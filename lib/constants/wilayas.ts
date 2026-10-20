/**
 * المعيار الإداري الوطني لولايات الجزائر (69 ولاية كاملة)
 * يتوافق بشكل تام مع المعيار الإداري لولايات الجزائر (Algeria 69 Wilayas Standard)
 */

export interface WilayaData {
  code: number;
  nameAr: string;
  nameFr: string;
  defaultHomeFee: number;
  defaultDeskFee: number;
  estimatedDays: string;
}

export const ALGERIA_WILAYAS: WilayaData[] = [
  { code: 1, nameAr: 'أدرار', nameFr: 'Adrar', defaultHomeFee: 900, defaultDeskFee: 600, estimatedDays: '3-5 أيام' },
  { code: 2, nameAr: 'الشلف', nameFr: 'Chlef', defaultHomeFee: 600, defaultDeskFee: 400, estimatedDays: '1-3 أيام' },
  { code: 3, nameAr: 'الأغواط', nameFr: 'Laghouat', defaultHomeFee: 700, defaultDeskFee: 500, estimatedDays: '2-4 أيام' },
  { code: 4, nameAr: 'أم البواقي', nameFr: 'Oum El Bouaghi', defaultHomeFee: 600, defaultDeskFee: 400, estimatedDays: '1-3 أيام' },
  { code: 5, nameAr: 'باتنة', nameFr: 'Batna', defaultHomeFee: 600, defaultDeskFee: 400, estimatedDays: '1-3 أيام' },
  { code: 6, nameAr: 'بجاية', nameFr: 'Béjaïa', defaultHomeFee: 600, defaultDeskFee: 400, estimatedDays: '1-3 أيام' },
  { code: 7, nameAr: 'بسكرة', nameFr: 'Biskra', defaultHomeFee: 700, defaultDeskFee: 500, estimatedDays: '2-4 أيام' },
  { code: 8, nameAr: 'بشار', nameFr: 'Béchar', defaultHomeFee: 900, defaultDeskFee: 600, estimatedDays: '3-5 أيام' },
  { code: 9, nameAr: 'البليدة', nameFr: 'Blida', defaultHomeFee: 500, defaultDeskFee: 350, estimatedDays: '24-48 ساعة' },
  { code: 10, nameAr: 'البويرة', nameFr: 'Bouira', defaultHomeFee: 600, defaultDeskFee: 400, estimatedDays: '1-3 أيام' },
  { code: 11, nameAr: 'تمنراست', nameFr: 'Tamanrasset', defaultHomeFee: 1100, defaultDeskFee: 800, estimatedDays: '4-7 أيام' },
  { code: 12, nameAr: 'تبسة', nameFr: 'Tébessa', defaultHomeFee: 600, defaultDeskFee: 400, estimatedDays: '1-3 أيام' },
  { code: 13, nameAr: 'تلمسان', nameFr: 'Tlemcen', defaultHomeFee: 700, defaultDeskFee: 450, estimatedDays: '2-3 أيام' },
  { code: 14, nameAr: 'تيارت', nameFr: 'Tiaret', defaultHomeFee: 650, defaultDeskFee: 450, estimatedDays: '2-3 أيام' },
  { code: 15, nameAr: 'تيزي وزو', nameFr: 'Tizi Ouzou', defaultHomeFee: 600, defaultDeskFee: 400, estimatedDays: '1-3 أيام' },
  { code: 16, nameAr: 'الجزائر العاصمة', nameFr: 'Alger', defaultHomeFee: 450, defaultDeskFee: 300, estimatedDays: '24-48 ساعة' },
  { code: 17, nameAr: 'الجلفة', nameFr: 'Djelfa', defaultHomeFee: 700, defaultDeskFee: 500, estimatedDays: '2-4 أيام' },
  { code: 18, nameAr: 'جيجل', nameFr: 'Jijel', defaultHomeFee: 600, defaultDeskFee: 400, estimatedDays: '1-3 أيام' },
  { code: 19, nameAr: 'سطيف', nameFr: 'Sétif', defaultHomeFee: 600, defaultDeskFee: 400, estimatedDays: '1-3 أيام' },
  { code: 20, nameAr: 'سعيدة', nameFr: 'Saïda', defaultHomeFee: 700, defaultDeskFee: 500, estimatedDays: '2-4 أيام' },
  { code: 21, nameAr: 'سكيكدة', nameFr: 'Skikda', defaultHomeFee: 600, defaultDeskFee: 400, estimatedDays: '1-3 أيام' },
  { code: 22, nameAr: 'سيدي بلعباس', nameFr: 'Sidi Bel Abbès', defaultHomeFee: 700, defaultDeskFee: 450, estimatedDays: '2-3 أيام' },
  { code: 23, nameAr: 'عنابة', nameFr: 'Annaba', defaultHomeFee: 600, defaultDeskFee: 400, estimatedDays: '1-3 أيام' },
  { code: 24, nameAr: 'قالمة', nameFr: 'Guelma', defaultHomeFee: 500, defaultDeskFee: 350, estimatedDays: '24-48 ساعة' }, // مقرنا الرئيسي
  { code: 25, nameAr: 'قسنطينة', nameFr: 'Constantine', defaultHomeFee: 550, defaultDeskFee: 350, estimatedDays: '24-48 ساعة' },
  { code: 26, nameAr: 'المدية', nameFr: 'Médéa', defaultHomeFee: 600, defaultDeskFee: 400, estimatedDays: '1-3 أيام' },
  { code: 27, nameAr: 'مستغانم', nameFr: 'Mostaganem', defaultHomeFee: 650, defaultDeskFee: 450, estimatedDays: '2-3 أيام' },
  { code: 28, nameAr: 'المسيلة', nameFr: 'M\'Sila', defaultHomeFee: 650, defaultDeskFee: 450, estimatedDays: '2-3 أيام' },
  { code: 29, nameAr: 'معسكر', nameFr: 'Mascara', defaultHomeFee: 650, defaultDeskFee: 450, estimatedDays: '2-3 أيام' },
  { code: 30, nameAr: 'ورقلة', nameFr: 'Ouargla', defaultHomeFee: 800, defaultDeskFee: 600, estimatedDays: '3-5 أيام' },
  { code: 31, nameAr: 'وهران', nameFr: 'Oran', defaultHomeFee: 650, defaultDeskFee: 450, estimatedDays: '2-3 أيام' },
  { code: 32, nameAr: 'البيض', nameFr: 'El Bayadh', defaultHomeFee: 850, defaultDeskFee: 600, estimatedDays: '3-5 أيام' },
  { code: 33, nameAr: 'إليزي', nameFr: 'Illizi', defaultHomeFee: 1100, defaultDeskFee: 850, estimatedDays: '4-7 أيام' },
  { code: 34, nameAr: 'برج بوعريريج', nameFr: 'Bordj Bou Arréridj', defaultHomeFee: 600, defaultDeskFee: 400, estimatedDays: '1-3 أيام' },
  { code: 35, nameAr: 'بومرداس', nameFr: 'Boumerdès', defaultHomeFee: 550, defaultDeskFee: 350, estimatedDays: '24-48 ساعة' },
  { code: 36, nameAr: 'الطارف', nameFr: 'El Tarf', defaultHomeFee: 550, defaultDeskFee: 350, estimatedDays: '24-48 ساعة' },
  { code: 37, nameAr: 'تندوف', nameFr: 'Tindouf', defaultHomeFee: 1200, defaultDeskFee: 900, estimatedDays: '4-7 أيام' },
  { code: 38, nameAr: 'تسمسيلت', nameFr: 'Tissemsilt', defaultHomeFee: 700, defaultDeskFee: 500, estimatedDays: '2-4 أيام' },
  { code: 39, nameAr: 'الوادي', nameFr: 'El Oued', defaultHomeFee: 800, defaultDeskFee: 550, estimatedDays: '2-4 أيام' },
  { code: 40, nameAr: 'خنشلة', nameFr: 'Khenchela', defaultHomeFee: 600, defaultDeskFee: 400, estimatedDays: '1-3 أيام' },
  { code: 41, nameAr: 'سوق أهراس', nameFr: 'Souk Ahras', defaultHomeFee: 550, defaultDeskFee: 350, estimatedDays: '24-48 ساعة' },
  { code: 42, nameAr: 'تيبازة', nameFr: 'Tipaza', defaultHomeFee: 550, defaultDeskFee: 350, estimatedDays: '24-48 ساعة' },
  { code: 43, nameAr: 'ميلة', nameFr: 'Mila', defaultHomeFee: 550, defaultDeskFee: 350, estimatedDays: '24-48 ساعة' },
  { code: 44, nameAr: 'عين الدفلى', nameFr: 'Aïn Defla', defaultHomeFee: 600, defaultDeskFee: 400, estimatedDays: '1-3 أيام' },
  { code: 45, nameAr: 'النعامة', nameFr: 'Naâma', defaultHomeFee: 850, defaultDeskFee: 600, estimatedDays: '3-5 أيام' },
  { code: 46, nameAr: 'عين تموشنت', nameFr: 'Aïn Témouchent', defaultHomeFee: 700, defaultDeskFee: 450, estimatedDays: '2-3 أيام' },
  { code: 47, nameAr: 'غرداية', nameFr: 'Ghardaïa', defaultHomeFee: 800, defaultDeskFee: 550, estimatedDays: '2-4 أيام' },
  { code: 48, nameAr: 'غليزان', nameFr: 'Relizane', defaultHomeFee: 650, defaultDeskFee: 450, estimatedDays: '2-3 أيام' },
  { code: 49, nameAr: 'تيميمون', nameFr: 'Timimoun', defaultHomeFee: 950, defaultDeskFee: 650, estimatedDays: '3-6 أيام' },
  { code: 50, nameAr: 'برج باجي مختار', nameFr: 'Bordj Badji Mokhtar', defaultHomeFee: 1200, defaultDeskFee: 900, estimatedDays: '5-8 أيام' },
  { code: 51, nameAr: 'أولاد جلال', nameFr: 'Ouled Djellal', defaultHomeFee: 750, defaultDeskFee: 500, estimatedDays: '2-4 أيام' },
  { code: 52, nameAr: 'بني عباس', nameFr: 'Béni Abbès', defaultHomeFee: 950, defaultDeskFee: 650, estimatedDays: '3-6 أيام' },
  { code: 53, nameAr: 'عين صالح', nameFr: 'In Salah', defaultHomeFee: 1100, defaultDeskFee: 800, estimatedDays: '4-7 أيام' },
  { code: 54, nameAr: 'عين قزام', nameFr: 'In Guezzam', defaultHomeFee: 1200, defaultDeskFee: 900, estimatedDays: '5-8 أيام' },
  { code: 55, nameAr: 'تقرت', nameFr: 'Touggourt', defaultHomeFee: 800, defaultDeskFee: 550, estimatedDays: '2-4 أيام' },
  { code: 56, nameAr: 'جانت', nameFr: 'Djanet', defaultHomeFee: 1200, defaultDeskFee: 900, estimatedDays: '5-8 أيام' },
  { code: 57, nameAr: 'المغير', nameFr: 'El M\'Ghair', defaultHomeFee: 800, defaultDeskFee: 550, estimatedDays: '2-4 أيام' },
  { code: 58, nameAr: 'المنيعة', nameFr: 'El Meniaa', defaultHomeFee: 900, defaultDeskFee: 600, estimatedDays: '3-5 أيام' },
  { code: 59, nameAr: 'عين وسارة', nameFr: 'Aïn Oussara', defaultHomeFee: 700, defaultDeskFee: 500, estimatedDays: '2-4 أيام' },
  { code: 60, nameAr: 'بريكة', nameFr: 'Barika', defaultHomeFee: 650, defaultDeskFee: 450, estimatedDays: '2-3 أيام' },
  { code: 61, nameAr: 'بوسعادة', nameFr: 'Bou Saâda', defaultHomeFee: 700, defaultDeskFee: 500, estimatedDays: '2-4 أيام' },
  { code: 62, nameAr: 'قصر الشلالة', nameFr: 'Ksar Chellala', defaultHomeFee: 700, defaultDeskFee: 500, estimatedDays: '2-4 أيام' },
  { code: 63, nameAr: 'مسعد', nameFr: 'Messaad', defaultHomeFee: 750, defaultDeskFee: 500, estimatedDays: '2-4 أيام' },
  { code: 64, nameAr: 'آفلو', nameFr: 'Aflou', defaultHomeFee: 750, defaultDeskFee: 500, estimatedDays: '2-4 أيام' },
  { code: 65, nameAr: 'العلمة', nameFr: 'El Eulma', defaultHomeFee: 600, defaultDeskFee: 400, estimatedDays: '1-3 أيام' },
  { code: 66, nameAr: 'أقبو', nameFr: 'Akbou', defaultHomeFee: 600, defaultDeskFee: 400, estimatedDays: '1-3 أيام' },
  { code: 67, nameAr: 'سيدي عيسى', nameFr: 'Sidi Aïssa', defaultHomeFee: 700, defaultDeskFee: 500, estimatedDays: '2-4 أيام' },
  { code: 68, nameAr: 'الأبيض سيدي الشيخ', nameFr: 'Labiodh Sidi Cheikh', defaultHomeFee: 900, defaultDeskFee: 600, estimatedDays: '3-5 أيام' },
  { code: 69, nameAr: 'شلغوم العيد', nameFr: 'Chelghoum Laïd', defaultHomeFee: 550, defaultDeskFee: 350, estimatedDays: '24-48 ساعة' },
];

export const TOTAL_ALGERIA_WILAYAS = 69;
