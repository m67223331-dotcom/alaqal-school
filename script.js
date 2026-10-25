/* =====================================================
   1) الإعدادات
   ===================================================== */
// حط بيانات Firebase هنا عشان التعديلات تتحفظ للكل (الخطوات اللي في الرد).
// لو سيبتهم فاضيين الموقع بيشتغل بالتجربة المحلية (التعديلات في المتصفح بس).
const CONFIG = {
  apiKey: 'AIzaSyDzc8TTblIaQ6oVSFZ01Sdxde3C58AP-hs',   // Web API Key
  databaseURL: 'https://aleqal-school-mm27-default-rtdb.europe-west1.firebasedatabase.app',
  adminEmail: 'admin@school.com' // نفس الإيميل اللي هتعمله في Firebase
};
// بصمة كلمة السر، للتجربة المحلية فقط (مش مستخدمة مع Firebase)
const LOCAL_HASH = '8b6fad1b5114d6d0c1b51d60cf079e1b207f3c5a04d2d1aaaa8cd71ae8b1ef82';
const CLOUD = !!(CONFIG.apiKey && CONFIG.databaseURL);

/* =====================================================
   2) النصوص (عربي / إنجليزي)
   ===================================================== */
const T = {
  ar: {
    school: 'مدرسة العقال البحري الثانوية المشتركة', welcome: 'أهلاً بكم في موقع المدرسة', mTitle: 'وزير التربية والتعليم',
    nHome: 'الرئيسية', nSch: 'جدول الحصص', nTop: 'أوائل 2026', nTea: 'المدرسون', nMin: 'كلمة الوزير', nGal: 'نبذة عن المدرسة', nCon: 'تواصل معنا',
    login: 'دخول الإدارة', logout: 'خروج', edit: 'تعديل', save: 'حفظ', cancel: 'إلغاء', del: 'حذف',
    addTop: 'إضافة متفوق', addTea: 'إضافة مدرس', addPic: 'إضافة صورة', tapEdit: 'اضغط على أي خانة لتعديلها',
    schTap: 'اضغط لاختيار فصلك', schSub: 'اختار فصلك وشوف جدول الحصص', schPick: 'اختار فصلك', back: 'رجوع',
    tName: 'اسم المدرس', tSub: 'المادة', tPhoto: 'صورة المدرس', tInfo: 'معلومات عن المدرس',
    empty: 'لا يوجد محتوى بعد.', per: 'الحصة', day: 'اليوم',
    days: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
    grades: ['أولى ثانوي بكالوريا', 'تانية ثانوي بكالوريا'],
    tg: ['أولى ثانوي', 'تانية ثانوي', 'تالتة ثانوي'],
    pw: 'اكتب كلمة السر', bad: 'كلمة السر غير صحيحة', saveErr: 'تعذر الحفظ، سجّل دخول الإدارة من جديد.', full: 'المساحة ممتلئة، استخدم صوراً أصغر.',
    topN: 'اسم الطالب', topS: 'المجموع / النسبة',
    mBio: 'اكتب كلمة الوزير', mNm: 'اسم الوزير', addr: 'العنوان', phone: 'الهاتف', mail: 'البريد الإلكتروني',
    total: 'المجموع', pct: 'النسبة', pTitle: 'مديرة المدرسة'
  },
  en: {
    school: 'Al-Eqal Al-Bahari Mixed Secondary School', welcome: 'Welcome to our school website', mTitle: 'Minister of Education',
    nHome: 'Home', nSch: 'Timetable', nTop: 'Top Students 2026', nTea: 'Teachers', nMin: "Minister's Word", nGal: 'About the School', nCon: 'Contact',
    login: 'Admin login', logout: 'Logout', edit: 'Edit', save: 'Save', cancel: 'Cancel', del: 'Delete',
    addTop: 'Add top student', addTea: 'Add teacher', addPic: 'Add photo', tapEdit: 'Tap any cell to edit it',
    schTap: 'Tap to choose your class', schSub: 'Pick your class to see its timetable', schPick: 'Choose your class', back: 'Back',
    tName: 'Teacher name', tSub: 'Subject', tPhoto: 'Teacher photo', tInfo: 'About the teacher',
    empty: 'Nothing here yet.', per: 'Period', day: 'Day',
    days: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
    grades: ['First Year (Baccalaureate)', 'Second Year (Baccalaureate)'],
    tg: ['First Year', 'Second Year', 'Third Year'],
    pw: 'Enter password', bad: 'Wrong password', saveErr: 'Could not save. Please log in again.', full: 'Storage is full, use smaller images.',
    topN: 'Student name', topS: 'Total / percentage',
    mBio: "Write the minister's word", mNm: 'Minister name', addr: 'Address', phone: 'Phone', mail: 'Email',
    total: 'Total', pct: 'Percentage', pTitle: 'School Principal'
  }
};

/* =====================================================
   3) البيانات الافتراضية والفصول
   ===================================================== */
const SUBJ = ['لغة عربية', 'لغة أجنبية أولى', 'لغة أجنبية ثانية', 'علوم متكاملة', 'تاريخ', 'رياضة', 'برمجة', 'فلسفة'];
const COUNT = [11, 5];                          // عدد فصول: أولى - تانية
const PERIODS = 8;                              // عدد الحصص في اليوم (غيّر الرقم ده بس لو عايز عدد تاني)
const classes = [];                             // مفاتيح زي 0-1 و0-2 (بدون / عشان Firebase)
COUNT.forEach((n, g) => { for (let s = 1; s <= n; s++) classes.push(`${g}-${s}`); });
const clsName = c => { const [g, s] = c.split('-'); return `${+g + 1}/${s}`; };


const clone = o => JSON.parse(JSON.stringify(o));
const toArr = v => Array.isArray(v) ? v : Object.values(v || {});
function defSch() {
  const o = {};
  classes.forEach((c, i) => { o[c] = Array.from({ length: 6 }, (_, d) => Array.from({ length: PERIODS }, (_, p) => SUBJ[(d + p + i) % SUBJ.length])); });
  return o;
}
const TOPS = [   // الأوائل: [الاسم، المجموع أو النسبة]
  [0, [
    ['محمد هشام شحاتة هاشم', '584.8'], ['أحمد محمد علي عبداللطيف', '583.1'], ['فاطمة عبدالنافع حفني راشد', '581'],
    ['محمود سمير محمد تمام', '579.9'], ['محمد أحمد علي علي', '577.2'], ['مروان قاسم محمود محمد', '575.5'],
    ['محمد عبدالعال نفادي حسين', '562.7'], ['أحمد عاطف محمود إسماعيل', '562.4'], ['ميرنا طلعت ناشد حكيم', '561.4'],
    ['علي محمد علي أحمد', '561.4']]],
  [1, [
    ['مروان هاني عبدالفتاح علي', '361.4'], ['ملك عصام سيد إسماعيل', '358.7'], ['علي أسامة فتحي حسن', '354.7'],
    ['سلمي عصمت أحمد محمد علي', '353.9'], ['شهد عبدالباسط محمد حسين', '353.6'], ['نوران أبوسليمان عبدالرحمن شهاب', '346.7'],
    ['ندي ممدوح حسين أحمد', '345.7'], ['فاطمة محمد أحمد علي', '345.2'], ['ملك عبدالحكيم محمد سيد', '344.7'],
    ['إسراء ممدوح عباس عثمان', '343.8']]],
  [2, [
    ['زياد الحسيني ناجي عبدالرحيم', '96.88%'], ['تسنيم عبدالخالق أحمد إسماعيل', '95.78%'], ['كيرلس إسحاق إبراهيم باشا', '94.84%'],
    ['شهد هشام شحاتة', '94.22%'], ['عبدالرحمن طه إبراهيم إسماعيل', '94.22%'], ['يوسف ضياء محمد أحمد', '93.12%'],
    ['بيشوي بولس سرجيوس حنين', '92.5%'], ['محمد علي أحمد عبدالرحمن', '92.19%'], ['أحمد خالد أحمد عبدالرحيم', '91.56%'],
    ['إسراء عاطف أحمد منصور', '91.41%']]]
].flatMap(([g, rows]) => rows.map(([n, s]) => ({ n, s, g })));
const DEF = {
  sch: defSch(), tops: [], teas: [], pics: []
};
// يكمّل أي حاجة ناقصة (Firebase بيحذف القوائم الفاضية)
function normalize(d) {
  const o = Object.assign(clone(DEF), d || {});
  ['tops', 'teas', 'pics'].forEach(k => { o[k] = toArr(o[k]); });
  if (o.seedV !== 2) {   // يضيف الأوائل الناقصين مرة واحدة بدون تكرار
    o.seedV = 2;
    TOPS.forEach(s => { if (!o.tops.some(x => x.n === s.n && (x.g ?? 0) === s.g)) o.tops.push({ ...s }); });
  }
  o.teas = o.teas.filter(m => !/^اسم المدرس \d+$/.test(m.n));   // يشيل الكروت المؤقتة القديمة
  const sch = Object.assign(defSch(), (d && d.sch) || {});
  classes.forEach(c => { sch[c] = toArr(sch[c]).map(r => { r = toArr(r); while (r.length < PERIODS) r.push(''); return r.slice(0, PERIODS); }); });
  o.sch = sch;
  return o;
}

/* =====================================================
   4) الحالة والأدوات
   ===================================================== */
const $ = s => document.querySelector(s);
const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let S = normalize(null);
let lang = localStorage.lang || 'ar';
let admin = sessionStorage.admin === '1';
let token = sessionStorage.token || '';
let cls = '';          // cls فاضي = لسه ما اختارش فصل
let topG = 0;
const t = k => T[lang][k];
const gName = i => t('grades')[i];

async function sha(s) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
}
function readImg(file, cb) {                    // تصغير الصورة قبل الحفظ
  const r = new FileReader();
  r.onload = () => {
    const im = new Image();
    im.onload = () => {
      const k = Math.min(1, 500 / Math.max(im.width, im.height)), c = document.createElement('canvas');
      c.width = im.width * k; c.height = im.height * k;
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      cb(c.toDataURL('image/jpeg', .7));
    };
    im.src = r.result;
  };
  r.readAsDataURL(file);
}

/* =====================================================
   5) التخزين (Firebase للكل / تجريبي محلي)
   ===================================================== */
async function load() {
  try {
    if (CLOUD) {
      const r = await fetch(`${CONFIG.databaseURL}/school.json`);
      if (r.ok) S = normalize(await r.json());
    } else {
      S = normalize(JSON.parse(localStorage.schoolLocal || 'null'));
    }
  } catch (_) { S = normalize(null); }
  render();
}
async function save() {
  if (!CLOUD) {
    try { localStorage.schoolLocal = JSON.stringify(S); } catch (_) { alert(t('full')); }
    return;
  }
  try {
    const r = await fetch(`${CONFIG.databaseURL}/school.json?auth=${token}`, { method: 'PUT', body: JSON.stringify(S) });
    if (!r.ok) throw new Error('save');
  } catch (_) { alert(t('saveErr')); setAdmin(false); }
}
function setAdmin(v) {
  admin = v; sessionStorage.admin = v ? '1' : '0';
  if (!v) { token = ''; sessionStorage.token = ''; }
  render();
}
async function login() {
  const p = prompt(t('pw'));
  if (p === null) return;
  try {
    if (CLOUD) {
      const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${CONFIG.apiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: CONFIG.adminEmail, password: p, returnSecureToken: true })
      });
      if (!r.ok) return alert(t('bad'));
      token = (await r.json()).idToken; sessionStorage.token = token;
    } else if (await sha(p) !== LOCAL_HASH) return alert(t('bad'));
    setAdmin(true);
  } catch (_) { alert(t('bad')); }
}

/* =====================================================
   6) العرض
   ===================================================== */
function delBtn(attr, i) { return admin ? `<button class="x" data-${attr}="${i}">${t('del')}</button>` : ''; }
const none = () => `<p>${t('empty')}</p>`;

function render() {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.title = t('school');
  document.querySelectorAll('[data-t]').forEach(n => { n.textContent = t(n.dataset.t); });
  $('#langBtn').textContent = lang === 'ar' ? 'EN' : 'عربي';
  $('#admBtn').textContent = admin ? t('logout') : t('login');
  document.body.classList.toggle('isadm', admin);


  // جدول الحصص: اختيار الفصل ثم عرض الجدول
  $('#schChips').innerHTML = COUNT.map((n, g) =>
    `<p class="hint">${e(gName(g))}</p><div class="chips">${Array.from({ length: n }, (_, k) => {
      const c = `${g}-${k + 1}`;
      return `<button type="button" class="chip ${c === cls ? 'on' : ''}" data-cls="${c}">${e(clsName(c))}</button>`;
    }).join('')}</div>`).join('');
  $('#schTitle').textContent = cls ? `${t('nSch')} ${clsName(cls)}` : t('schPick');
  $('#schPick').hidden = !!cls;
  $('#schView').hidden = !cls;
  $('#schBack').hidden = !cls;
  if (cls) {
    let h = `<tr><th>${t('day')}</th>${Array.from({ length: PERIODS }, (_, p) => `<th>${t('per')} ${p + 1}</th>`).join('')}</tr>`;
    S.sch[cls].forEach((r, d) => {
      h += `<tr><th>${t('days')[d]}</th>${r.map((c, p) => `<td class="${admin ? 'ed' : ''}" data-d="${d}" data-p="${p}">${e(c)}</td>`).join('')}</tr>`;
    });
    $('#schTbl').innerHTML = h;
  }

  // الأوائل (منصة + قائمة)
  $('#topTabs').innerHTML = [0, 1, 2].map(i => `<button type="button" class="pill ${i === topG ? 'on' : ''}" data-tg="${i}">${e(t('tg')[i])}</button>`).join('');
  const list = S.tops.map((s, i) => ({ ...s, i, g: s.g ?? 0 })).filter(s => s.g === topG)
    .sort((a, b) => (parseFloat(b.s) || 0) - (parseFloat(a.s) || 0));
  const medal = ['👑🥇', '🥈', '🥉'], sc = s => `${String(s.s).includes('%') ? t('pct') : t('total')} ${e(s.s)}`;
  const pod = [1, 0, 2].filter(k => list[k]).map(k =>
    `<div class="pod p${k + 1}"><div class="med">${medal[k]}</div><b>${e(list[k].n)}</b><span class="sc">${sc(list[k])}</span>${delBtn('dt', list[k].i)}</div>`).join('');
  const rest = list.slice(3).map((s, k) =>
    `<div class="card rank"><i>${k + 4}</i><b>${e(s.n)}</b><span class="sc">${sc(s)}</span>${delBtn('dt', s.i)}</div>`).join('');
  $('#tops').innerHTML = list.length ? `<div class="podium">${pod}</div><div class="ranks">${rest}</div>` : none();

  // المدرسون
  $('#teas').innerHTML = S.teas.map((m, i) =>
    `<div class="card">${m.p ? `<img src="${e(m.p)}" alt="" onerror="this.removeAttribute('src');this.onerror=null">` : ''}<b>${e(m.n)}</b><small>${e(m.s)}</small><p>${e(m.i)}</p>${admin ? `<button class="x lnk" data-et="${i}">${t('edit')}</button>` : ''}${delBtn('dm', i)}</div>`
  ).join('');

  // المعرض
  $('#pics').innerHTML = S.pics.map((p, i) => `<div><img src="${p}" alt="">${delBtn('dp', i)}</div>`).join('');

}

/* =====================================================
   7) الأحداث: القائمة واللغة والوضع الليلي والدخول
   ===================================================== */
const mb = $('#menuBtn'), mn = $('#menu');
const closeMenu = () => { mn.hidden = true; mb.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); };
mn.querySelectorAll('a').forEach((a, i) => a.style.setProperty('--i', i));
mb.onclick = () => { const open = mn.hidden; mn.hidden = !open; mb.classList.toggle('open', open); mb.setAttribute('aria-expanded', String(open)); };
mn.onclick = ev => { if (ev.target.tagName === 'A') closeMenu(); };
document.addEventListener('click', ev => { if (!mn.hidden && !mn.contains(ev.target) && !mb.contains(ev.target)) closeMenu(); });
document.addEventListener('keydown', ev => { if (ev.key === 'Escape') closeMenu(); });

$('#langBtn').onclick = () => { lang = lang === 'ar' ? 'en' : 'ar'; localStorage.lang = lang; render(); };
$('#themeBtn').onclick = () => {
  const d = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = d; localStorage.theme = d;
  $('#themeBtn').textContent = d === 'dark' ? '☀️' : '🌙';
};
document.documentElement.dataset.theme = localStorage.theme || 'light';
$('#themeBtn').textContent = localStorage.theme === 'dark' ? '☀️' : '🌙';
$('#admBtn').onclick = () => admin ? setAdmin(false) : login();

/* =====================================================
   8) الأحداث: فلاتر العرض
   ===================================================== */
$('#schOpen').onclick = () => { cls = ''; render(); $('#schDlg').showModal(); };
$('#schChips').onclick = ev => { const b = ev.target.closest('[data-cls]'); if (b) { cls = b.dataset.cls; render(); } };
$('#schBack').onclick = () => { cls = ''; render(); };
$('#schClose').onclick = () => $('#schDlg').close();
$('#schDlg').addEventListener('click', ev => { if (ev.target === ev.currentTarget) ev.currentTarget.close(); });
$('#topTabs').onclick = ev => { const b = ev.target.closest('[data-tg]'); if (!b) return; topG = +b.dataset.tg; render(); };

/* =====================================================
   9) الأحداث: التعديل (إدارة فقط)
   ===================================================== */
$('#schTbl').onclick = ev => {
  const c = ev.target.closest('td'); if (!admin || !c) return;
  const v = prompt(t('per'), c.textContent);
  if (v !== null) { S.sch[cls][c.dataset.d][c.dataset.p] = v; save(); render(); }
};
$('#addTop').onclick = () => {
  const n = prompt(t('topN')); if (!n) return;
  S.tops.push({ n, s: prompt(t('topS')) || '', g: topG }); save(); render();
};
document.body.addEventListener('click', ev => {   // الحذف
  const d = ev.target.dataset; if (!admin) return;
  if (d.et) {
    const m = S.teas[+d.et], n = prompt(t('tName'), m.n); if (n === null) return;
    m.n = n;
    const s = prompt(t('tSub'), m.s); if (s !== null) m.s = s;
    const i = prompt(t('tInfo'), m.i); if (i !== null) m.i = i;
  }
  else if (d.dt) S.tops.splice(+d.dt, 1);
  else if (d.dm) S.teas.splice(+d.dm, 1);
  else if (d.dp) S.pics.splice(+d.dp, 1);
  else return;
  save(); render();
});

/* =====================================================
   10) إضافة مدرس وصورة للمعرض
   ===================================================== */
$('#addTea').onclick = () => { $('#teaForm').reset(); $('#teaDlg').showModal(); };
$('#teaCancel').onclick = () => $('#teaDlg').close();
$('#teaForm').onsubmit = () => {
  const f = $('#tP').files[0], m = { n: $('#tN').value, s: $('#tS').value, i: $('#tI').value, p: '' };
  const done = () => { S.teas.push(m); save(); render(); };
  if (f) readImg(f, d => { m.p = d; done(); }); else done();
};
// عرض الصورة مكبرة عند الضغط عليها
const lb = $('#lightbox');
document.addEventListener('click', ev => {
  const im = ev.target.closest('.mosaic img, #pics img');
  if (im && im.getAttribute('src')) { lb.querySelector('img').src = im.src; lb.showModal(); }
});
lb.onclick = () => lb.close();
$('#addPic').onclick = () => $('#picFile').click();
$('#picFile').onchange = ev => {
  const f = ev.target.files[0]; if (!f) return;
  readImg(f, d => { S.pics.push(d); save(); render(); ev.target.value = ''; });
};

/* =====================================================
   11) التشغيل
   ===================================================== */
render();
load();
