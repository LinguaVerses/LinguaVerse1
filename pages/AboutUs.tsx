import React from 'react';
import { 
  Globe, BookOpen, Target, Heart, Users, ShieldAlert, 
  Code, Feather, Star, CheckCircle, Sparkles, Lock 
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  const handleJoinTeam = () => {
    Swal.fire({
      title: '<span class="text-purple-600">สนใจร่วมทีมกับเรา?</span>',
      html: `
        <div class="text-left text-sm text-slate-600">
          <p class="mb-2">LinguaVerse ยินดีต้อนรับผู้ที่มีใจรักในการแปลและการอ่านเสมอ!</p>
          <p>หากคุณมีความสามารถด้าน:</p>
          <ul class="list-disc pl-5 mb-4 text-purple-700 font-bold">
            <li>แปลภาษา (KR/CN/JP/EN -> TH)</li>
            <li>บรรณาธิการ (Proofreader)</li>
            <li>จัดหน้า/กราฟิก (Typesetter)</li>
          </ul>
          <p>โปรดส่ง Portfolio ของคุณมาที่อีเมลของเรา</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'ไปหน้าติดต่อเรา',
      confirmButtonColor: '#9333ea',
      showCancelButton: true,
      cancelButtonText: 'ไว้ก่อน'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/contact');
      }
    });
  };

  return (
    <div className="min-h-screen pt-16 pb-12 bg-slate-50 font-sarabun overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <div className="relative bg-slate-900 text-white py-20 md:py-32 overflow-hidden group">
        {/* Background Animation */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30 transform translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-[3s]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600 rounded-full blur-3xl opacity-30 transform -translate-x-1/2 translate-y-1/2 group-hover:scale-110 transition-transform duration-[3s]"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
           <div className="inline-block p-2 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 animate-fade-in-up">
              <span className="flex items-center gap-2 text-sm font-kanit font-bold tracking-wider uppercase text-purple-300">
                <Sparkles size={16} /> Welcome to Our Universe
              </span>
           </div>
           <h1 className="text-4xl md:text-6xl font-bold font-kanit mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-white to-pink-200 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
             เกี่ยวกับ LinguaVerse
           </h1>
           <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
             พื้นที่ส่วนตัวสำหรับนักอ่านที่หลงใหลในวรรณกรรมแปล เชื่อมต่อวัฒนธรรมผ่านตัวอักษร 
             และเปิดประตูสู่จินตนาการไร้พรมแดน
           </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
         
         {/* --- MISSION & VISION CARDS --- */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-purple-500/5 border border-purple-50 hover:border-purple-200 transition-all group">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:rotate-6 transition-transform">
                   <Target size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4 font-kanit">ภารกิจของเรา (Mission)</h2>
                <p className="text-slate-600 leading-loose text-justify">
                   LinguaVerse เป็นแพลตฟอร์มส่วนตัว สำหรับเก็บรักษา และแชร์นิยายแปลจากภาษาเกาหลี จีน ญี่ปุ่น และอังกฤษ 
                   ที่แปลเป็นภาษาไทย เพื่อเพื่อนสมาชิกที่ชื่นชอบการอ่านนิยายแปลเท่านั้น เราเชื่อว่าการแปลและการอ่านงานวรรณกรรมที่ดี 
                   เป็นวิธีที่ยอดเยี่ยมในการเรียนรู้วัฒนธรรมและภาษาต่างๆ ผ่านเรื่องราวที่น่าสนใจจากการแปลที่มีคุณภาพ และเข้าถึงได้ง่าย
                </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl shadow-pink-500/5 border border-pink-50 hover:border-pink-200 transition-all group">
                <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 mb-6 group-hover:-rotate-6 transition-transform">
                   <Globe size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4 font-kanit">วิสัยทัศน์ของเรา (Vision)</h2>
                <p className="text-slate-600 leading-loose text-justify">
                   เราต้องการสร้างชุมชนผู้รักการอ่านที่ชื่นชมวรรณกรรมต่างประเทศ และสนับสนุนการแปลคุณภาพสูง 
                   ผ่านการให้ความสำคัญกับประสบการณ์ผู้อ่านและการสนับสนุนผู้แปล เพื่อให้วรรณกรรมเหล่านี้ยังคงอยู่และส่งต่อความประทับใจ
                   ให้แก่ผู้คนในวงกว้าง
                </p>
            </div>
         </div>

         {/* --- VALUES SECTION --- */}
         <div className="mb-20">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-slate-800 font-kanit mb-3">ค่านิยมหลักของเรา</h2>
               <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Quality */}
               <div className="text-center p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-200">
                     <Star size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3 font-kanit">คุณภาพ (Quality)</h3>
                  <p className="text-slate-500 leading-relaxed">
                     เรามุ่งมั่นที่จะให้การแปลที่ถูกต้อง เข้าใจง่าย ลื่นไหลไปตามอารมณ์ที่ผู้แต่งต้องการสื่อ 
                     เพื่ออรรถรสในการอ่านสูงสุด
                  </p>
               </div>

               {/* Community */}
               <div className="text-center p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-pink-200">
                     <Heart size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3 font-kanit">ชุมชน (Community)</h3>
                  <p className="text-slate-500 leading-relaxed">
                     เราสร้างพื้นที่สำหรับเชื่อมต่อกับผู้อ่าน เพื่อแบ่งปันความคิดเห็น แชร์ประสบการณ์ 
                     และพูดคุยกันอย่างเป็นกันเอง
                  </p>
               </div>

               {/* Team */}
               <div className="text-center p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-amber-200">
                     <Users size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3 font-kanit">ทีมของเรา (Our Team)</h3>
                  <p className="text-slate-500 leading-relaxed">
                     ก่อตั้งโดยกลุ่มผู้รักการอ่าน ทั้งผู้แปล บรรณาธิการ และนักพัฒนา 
                     ที่ทำงานด้วยความหลงใหล (Passion) เพื่อมอบสิ่งที่ดีที่สุด
                  </p>
               </div>
            </div>
         </div>

         {/* --- TEAM ROLES --- */}
         <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm mb-20 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
             <div className="absolute top-0 left-0 w-64 h-64 bg-pink-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

             <div className="relative z-10">
                <h2 className="text-3xl font-bold text-slate-800 font-kanit mb-8 text-center">เบื้องหลังความสำเร็จ</h2>
                <div className="flex flex-wrap justify-center gap-8">
                   <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                         <Globe size={28} />
                      </div>
                      <span className="font-bold text-slate-700">Translators</span>
                   </div>
                   <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3">
                         <Feather size={28} />
                      </div>
                      <span className="font-bold text-slate-700">Editors</span>
                   </div>
                   <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                         <Code size={28} />
                      </div>
                      <span className="font-bold text-slate-700">Developers</span>
                   </div>
                   <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mb-3">
                         <BookOpen size={28} />
                      </div>
                      <span className="font-bold text-slate-700">Readers</span>
                   </div>
                </div>
                
                <div className="text-center mt-10">
                   <button 
                     onClick={handleJoinTeam}
                     className="px-8 py-3 bg-white border-2 border-purple-600 text-purple-600 font-bold rounded-full hover:bg-purple-600 hover:text-white transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
                   >
                     สนใจร่วมเป็นส่วนหนึ่งของทีม?
                   </button>
                </div>
             </div>
         </div>

         {/* --- PRIVACY SECTION (CRITICAL) --- */}
         <div className="max-w-4xl mx-auto mb-16 animate-pulse-slow">
             <div className="bg-red-50 border-l-8 border-red-500 rounded-r-xl p-8 shadow-md flex flex-col md:flex-row gap-6 items-start">
                 <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 shrink-0 mx-auto md:mx-0">
                     <ShieldAlert size={36} />
                 </div>
                 <div className="text-center md:text-left">
                     <h3 className="text-2xl font-bold text-red-700 font-kanit mb-3 flex items-center justify-center md:justify-start gap-2">
                         <Lock size={24} /> ความเป็นส่วนตัว (Privacy Notice)
                     </h3>
                     <p className="text-red-800/80 leading-relaxed font-medium">
                        LinguaVerse ก่อตั้งขึ้นโดยกลุ่มผู้รักการอ่านและการแปล ที่มีความหลงใหลในการแบ่งปันวรรณกรรมที่ดี 
                        ทีมของเราประกอบด้วยผู้แปล บรรณาธิการ และนักพัฒนา ที่ทำงานเพื่อให้ประสบการณ์ที่ดีที่สุดแก่ผู้อ่าน 
                        <br/><br/>
                        <span className="font-bold bg-red-200 px-1 text-red-900">
                          เราขอสงวนสิทธิ์ในการให้บริการเฉพาะสมาชิกเท่านั้น
                        </span> 
                        เนื้อหาทั้งหมดภายในเว็บไซต์จัดทำขึ้นเพื่อความบันเทิงและการศึกษาภายในกลุ่ม 
                        ห้ามมิให้ทำการคัดลอก เผยแพร่ต่อ หรือนำไปใช้ในเชิงพาณิชย์โดยเด็ดขาด
                     </p>
                 </div>
             </div>
         </div>

      </div>
    </div>
  );
};

export default AboutUs;
