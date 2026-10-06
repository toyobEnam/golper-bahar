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
      const errorBody = await response.text();
      throw new Error(
        `Apps Script সার্ভার এরর: ${response.status} ${response.statusText}\n${errorBody}`
      );
    }

    const data = await response.json();

    if (!data || typeof data !== 'object') {
      throw new Error('Apps Script থেকে বৈধ JSON ডাটা পাওয়া যায়নি।');
    }

    if (!Array.isArray(data.approvedComments)) {
      throw new Error('approvedComments একটি array নয়।');
    }

    if (!Array.isArray(data.storyStats)) {
      throw new Error('storyStats একটি array নয়।');
    }

    const approvedComments = data.approvedComments;
    const storyStats = data.storyStats;

    console.log(`মোট অনুমোদিত মন্তব্য: ${approvedComments.length}`);
    console.log(`মোট গল্পের স্ট্যাটস: ${storyStats.length}`);

    let hasChanges = false;
    const syncedCommentIds = [];

    // ১. পর্বের ফাইলে কমেন্ট ইনজেক্ট করা
    if (approvedComments.length > 0) {
      const commentsByFile = {};
      approvedComments.forEach(item => {
        if (!item.filePath) return;
        const cleanPath = String(item.filePath || '')
          .replace(/\\/g, '/')
          .replace(/^\/+/, '');
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

            // যেসব Approved comment-এর নির্দিষ্ট HTML ফাইল ও marker পাওয়া গেছে,
            // সেগুলো sync-এর জন্য সফল হিসেবে ধরা হবে।
            comments.forEach(c => {
              if (c.id && !syncedCommentIds.includes(c.id)) {
                syncedCommentIds.push(c.id);
              }
            });

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
        const cleanIndexPath = String(stat.indexPath || '')
          .replace(/\\/g, '/')
          .replace(/^\/+/, '');
        const indexPath = path.join(process.cwd(), cleanIndexPath);

        if (fs.existsSync(indexPath)) {
          let content = fs.readFileSync(indexPath, 'utf8');
          let modified = false;

          const bnViews = toBengaliNumber(stat.views || 0);
          const bnComments = toBengaliNumber(stat.comments || 0);

          // ভিউ মার্কার আপডেট
          const viewRegex = /<!-- STORY_VIEWS -->([\s\S]*?)<!-- \/STORY_VIEWS -->/;
          if (viewRegex.test(content)) {
            const newViewText = `<!-- STORY_VIEWS -->${bnViews} বার পড়া হয়েছে<!-- /STORY_VIEWS -->`;
            content = content.replace(viewRegex, (match) => {
              if (match === newViewText) return match;
              modified = true;
              return newViewText;
            });
          }

          // কমেন্ট সংখ্যা মার্কার আপডেট
          const commentRegex = /<!-- STORY_COMMENTS -->([\s\S]*?)<!-- \/STORY_COMMENTS -->/;
          if (commentRegex.test(content)) {
            const newCommentText = `<!-- STORY_COMMENTS -->${bnComments}টি মন্তব্য<!-- /STORY_COMMENTS -->`;
            content = content.replace(commentRegex, (match) => {
              if (match === newCommentText) return match;
              modified = true;
              return newCommentText;
            });
          }

          if (modified) {
            fs.writeFileSync(indexPath, content, 'utf8');
            console.log(`স্ট্যাটস আপডেট হয়েছে: ${cleanIndexPath}`);
            hasChanges = true;
          }
        }
      }
    }

    // GitHub push সফল হওয়ার পর Apps Script-কে যেসব comment ID
    // Sheet থেকে মুছে ফেলতে হবে, সেগুলো temporary file-এ রাখা হচ্ছে।
    const cleanupFile = path.join(process.cwd(), '.sync-comment-ids.json');

    if (syncedCommentIds.length > 0) {
      fs.writeFileSync(
        cleanupFile,
        JSON.stringify(syncedCommentIds, null, 2),
        'utf8'
      );

      console.log(`Cleanup-এর জন্য ${syncedCommentIds.length}টি comment ID প্রস্তুত করা হয়েছে।`);
    } else {
      console.log("Cleanup করার মতো কোনো Approved comment পাওয়া যায়নি।");
    }

    if (!hasChanges) {
      console.log("নতুন কোনো ফাইল পরিবর্তনের প্রয়োজন নেই।");
    } else {
      console.log("সব ফাইল সফলভাবে আপডেট করা সম্পন্ন হয়েছে।");
    }

  } catch (error) {
    console.error("========================================");
    console.error("সিঙ্ক করার সময় ত্রুটি ঘটেছে!");
    console.error("Error:", error.message || error);
    console.error("========================================");
    process.exit(1);
  }
}

runSync();