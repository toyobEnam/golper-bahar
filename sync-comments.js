const fs = require('fs');
const path = require('path');

// আপনার গুগল অ্যাপস স্ক্রিপ্ট ডিপ্লয়মেন্ট ইউআরএল
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwU75Chu74PABjZ_GYXT4fGD6XTAU1KXA5sS7WnP7tdeOcxsPAMtyAjKiaPlCKzutDW/exec";

// ইংরেজি সংখ্যাকে বাংলা সংখ্যায় রূপান্তর
function toBengaliNumber(num) {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, d => bnDigits[d]);
}

// এক্সএসএস ও স্পেশাল ক্যারেক্টার নিরাপদ করা
function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function runSync() {
  try {
    console.log("গুগল শিট থেকে ডাটা আনা হচ্ছে...");
    const response = await fetch(APPS_SCRIPT_URL);
    if (!response.ok) {
      throw new Error(`সার্ভার এরর: ${response.statusText}`);
    }

    const data = await response.json();
    const approvedComments = data.approvedComments || [];
    const storyStats = data.storyStats || [];

    console.log(`মোট অনুমোদিত মন্তব্য: ${approvedComments.length}`);
    console.log(`মোট গল্পের স্ট্যাটস: ${storyStats.length}`);

    let hasChanges = false;

    // ১. পর্বের ফাইলে কমেন্ট ইনজেক্ট করা
    if (approvedComments.length > 0) {
      const commentsByFile = {};
      approvedComments.forEach(item => {
        if (!item.filePath) return;
        const cleanPath = item.filePath.replace(/^\/+/, '');
        if (!commentsByFile[cleanPath]) commentsByFile[cleanPath] = [];
        commentsByFile[cleanPath].push(item);
      });

      for (const [relPath, comments] of Object.entries(commentsByFile)) {
        const fullPath = path.join(process.cwd(), relPath);

        if (fs.existsSync(fullPath)) {
          let content = fs.readFileSync(fullPath, 'utf8');
          const markerStart = "<!-- COMMENTS_START -->";
          const markerEnd = "<!-- COMMENTS_END -->";

          if (content.includes(markerStart) && content.includes(markerEnd)) {
            // ডুপ্লিকেট কমেন্ট ঠেকাতে আইডি চেক
            const newCommentsToInject = comments.filter(c => !content.includes(`id="${c.id}"`));

            if (newCommentsToInject.length > 0) {
              const commentsHtml = newCommentsToInject.map(c => `
    <div class="gb-comment" id="${escapeHtml(c.id)}">
      <div class="gb-comment-author">
        <span class="gb-comment-author-name">${escapeHtml(c.name)}</span>
        <span class="gb-comment-date">${escapeHtml(c.date)}</span>
      </div>
      <div class="gb-comment-text">${escapeHtml(c.comment).replace(/\n/g, '<br>')}</div>
    </div>`).join('\n');

              const regex = new RegExp(`(${markerStart})([\\s\\S]*?)(${markerEnd})`);
              
              // নতুন কমেন্টগুলো মার্কারের ভেতরে যুক্ত করা
              content = content.replace(regex, (match, p1, existingContent, p3) => {
                return `${p1}\n${commentsHtml}${existingContent}\n    ${p3}`;
              });

              fs.writeFileSync(fullPath, content, 'utf8');
              console.log(`আপডেট হয়েছে: ${relPath}`);
              hasChanges = true;
            }
          } else {
            console.warn(`মার্কার পাওয়া যায়নি ফাইলে: ${relPath}`);
          }
        } else {
          console.warn(`ফাইল খুঁজে পাওয়া যায়নি: ${fullPath}`);
        }
      }
    }

    // ২. ইনডেক্স ও অনুগল্প পাতায় ভিউ এবং মোট কমেন্ট সংখ্যা আপডেট করা
    if (storyStats.length > 0) {
      for (const stat of storyStats) {
        if (!stat.indexPath) continue;
        const cleanIndexPath = stat.indexPath.replace(/^\/+/, '');
        const indexPath = path.join(process.cwd(), cleanIndexPath);

        if (fs.existsSync(indexPath)) {
          let content = fs.readFileSync(indexPath, 'utf8');
          let modified = false;

          const bnViews = toBengaliNumber(stat.views || 0);
          const bnComments = toBengaliNumber(stat.comments || 0);

          // ভিউ মার্কার আপডেট
          const viewRegex = /<!-- STORY_VIEWS -->([\s\S]*?)<!-- \/STORY_VIEWS -->/;
          if (viewRegex.test(content)) {
            content = content.replace(viewRegex, `<!-- STORY_VIEWS -->${bnViews} বার পড়া হয়েছে<!-- /STORY_VIEWS -->`);
            modified = true;
          }

          // কমেন্ট সংখ্যা মার্কার আপডেট
          const commentRegex = /<!-- STORY_COMMENTS -->([\s\S]*?)<!-- \/STORY_COMMENTS -->/;
          if (commentRegex.test(content)) {
            content = content.replace(commentRegex, `<!-- STORY_COMMENTS -->${bnComments}টি মন্তব্য<!-- /STORY_COMMENTS -->`);
            modified = true;
          }

          if (modified) {
            fs.writeFileSync(indexPath, content, 'utf8');
            console.log(`স্ট্যাটস আপডেট হয়েছে: ${cleanIndexPath}`);
            hasChanges = true;
          }
        }
      }
    }

    if (!hasChanges) {
      console.log("নতুন কোনো ফাইল পরিবর্তনের প্রয়োজন নেই।");
    } else {
      console.log("সব ফাইল সফলভাবে আপডেট করা সম্পন্ন হয়েছে।");
    }

  } catch (error) {
    console.error("সিঙ্ক করার সময় ত্রুটি ঘটেছে:", error);
    process.exit(1);
  }
}

runSync();