import { Novel, NovelStatus, NovelLanguage, NOVEL_GENRES } from './types';

export const MOCK_NOVELS: Novel[] = Array.from({ length: 150 }).map((_, index) => {
  const languages = [NovelLanguage.KR, NovelLanguage.CN, NovelLanguage.JP, NovelLanguage.EN, NovelLanguage.TH];
  const statuses = [NovelStatus.ONGOING, NovelStatus.COMPLETE, NovelStatus.HIATUS, NovelStatus.COMING_SOON];
  const lang = languages[Math.floor(Math.random() * languages.length)];
  
  // Simulate a limited number of authors to ensure "Other Works" has matches
  const authorId = Math.floor(Math.random() * 20) + 1; 

  return {
    id: `novel-${index}`,
    titleEn: `The Legend of the ${lang} Hero Vol.${index + 1}`,
    titleTh: `ตำนานฮีโร่ ${lang} เล่มที่ ${index + 1}`,
    titleOriginal: `Original Title ${index + 1}`,
    coverUrl: `https://picsum.photos/300/450?random=${index}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    rating: Number((3 + Math.random() * 2).toFixed(1)),
    language: lang,
    author: `Author Name ${authorId}`,
    genres: [
      NOVEL_GENRES[Math.floor(Math.random() * NOVEL_GENRES.length)],
      NOVEL_GENRES[Math.floor(Math.random() * NOVEL_GENRES.length)]
    ],
    isNew: Math.random() > 0.8,
    isUp: Math.random() > 0.7,
    isCopyrighted: Math.random() > 0.5,
    description: `ในโลกที่ถูกปกครองด้วยพลังยุทธ์และเวทมนตร์ ชายหนุ่มผู้ไร้ซึ่งพรสวรรค์ต้องดิ้นรนเอาชีวิตรอดท่ามกลางความขัดแย้งของสำนักใหญ่ เขาถูกมองว่าเป็นเพียงขยะที่ไร้ค่า แต่แล้ววันหนึ่ง โชคชะตาก็เล่นตลกเมื่อเขาบังเอิญไปพบกับคัมภีร์ลึกลับในหุบเขาบรรพกาล

    คัมภีร์เล่มนั้นได้เปลี่ยนชีวิตเขาไปตลอดกาล พลังที่หลับใหลอยู่ภายในถูกปลุกให้ตื่นขึ้น พร้อมกับภารกิจอันยิ่งใหญ่ที่ต้องแบกรับ เขาต้องออกเดินทางเพื่อฝึกฝนตนเอง รวบรวมพรรคพวก และต่อกรกับจอมมารที่กำลังจะฟื้นคืนชีพ 
    
    ทว่าเส้นทางสู่ความเป็นหนึ่งนั้นไม่ได้โรยด้วยกลีบกุหลาบ เขาต้องเผชิญกับการทรยศหักหลัง ความรักที่ต้องเสียสละ และการสูญเสียที่ไม่อาจหลีกเลี่ยง นี่คือตำนานบทใหม่ของผู้ที่จะก้าวขึ้นมาเป็นราชันย์แห่งยุทธภพ!`
  };
});

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Novels', path: '/novels' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact Us', path: '/contact' },
];