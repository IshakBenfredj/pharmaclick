# 🎨 قواعد وأنماط استخدام Tailwind CSS وتصميم PharmaClick

يجب على المساعد البرمجي (AI Assistant) والمطورين الالتزام الصارم بهذه القواعد عند كتابة أي كود واجهة (UI) في المشروع:

---

## 1. قواعد مسميات الألوان (Brand Colors Tokens)
ممنوع نهائياً استخدام أكواد الألوان الست عشرية المباشرة (Arbitrary Hex) مثل `[#064F68]` إذا كان اللون معرفاً في `@theme`. استخدم دائماً مسميات التوكنز:

| اللون | الكود الست عشري | الاستخدام الصحيح في Tailwind v4 | ممنوع الاستخدام |
| :--- | :--- | :--- | :--- |
| **Deep Teal Blue** | `#064F68` | `bg-brand-deep`, `text-brand-deep`, `border-brand-deep` | `bg-[#064F68]`, `text-[#064F68]` |
| **Teal** | `#007F91` | `bg-brand-teal`, `text-brand-teal`, `border-brand-teal` | `bg-[#007F91]`, `text-[#007F91]` |
| **Turquoise** | `#00BFA5` | `bg-brand-turquoise`, `text-brand-turquoise` | `bg-[#00BFA5]`, `text-[#00BFA5]` |
| **Vibrant Green** | `#00C853` | `bg-brand-green`, `text-brand-green`, `border-brand-green` | `bg-[#00C853]`, `text-[#00C853]` |
| **Lime Green** | `#7CDE00` | `bg-brand-lime`, `text-brand-lime`, `border-brand-lime` | `bg-[#7CDE00]`, `text-[#7CDE00]` |

---

## 2. قواعد التدرجات (Gradients in Tailwind CSS v4)
* في Tailwind CSS v4، تم استبدال الكلمة القديمة `bg-gradient-to-*` بالكلمة القياسية `bg-linear-to-*`.
* **صحيح:** `bg-linear-to-r`, `bg-linear-to-l`, `bg-linear-to-t`, `bg-linear-to-b`.
* **ممنوع:** `bg-gradient-to-r`, `bg-gradient-to-b`.
* **مثال معتمد:** `bg-linear-to-r from-brand-deep via-brand-teal to-brand-turquoise`.

---

## 3. قواعد المسافات والأبعاد (Spacing & Dimensions)
* يفضل دائماً استخدام مقاييس Tailwind القياسية بدلاً من الأقواس المربعة `[...]`:
  * `300px` ⬅ استخدم `h-75` أو `min-h-75` أو `w-75` (حيث 75 × 4px = 300px).
  * `360px` ⬅ استخدم `h-90` أو `min-h-90` أو `w-90` (حيث 90 × 4px = 360px).
* تجنب التعارض بين كلاسات العرض في نفس العنصر، مثل الجمع بين `block` و `flex` (كلاهما يحدد خاصية `display`). استخدم `flex` فقط.

---

## 4. قواعد الخطوط (Typography Rules)
* **للغة العربية:** استخدام خط **IBM Plex Sans Arabic** (`--font-ibm-plex-arabic`).
* **للغتين الإنجليزية والفرنسية والأرقام:** استخدام خط **Poppins** (`--font-poppins`).
* **الخط الافتراضي (font-sans):** تم ضبطه ليدمج الخطين معاً تلقائياً:
  `font-family: var(--font-ibm-plex-arabic), var(--font-poppins), system-ui, sans-serif;`
  حيث يستخدم المتصفح خط IBM Plex Sans للحروف العربية وخط Poppins للحروف اللاتينية والأرقام بسلاسة فائقة.
* كلاسات المساعدة المتوفرة في Tailwind v4:
  * `font-sans` (الافتراضي الذكي للجميع)
  * `font-arabic` (خاص بالمحتوى العربي)
  * `font-latin` (خاص بالأسماء اللاتينية بالفرنسية والإنجليزية)

---

## 5. قواعد الأيقونات والهوية البصرية الخاصة بالصيدلية
* ❌ **ممنوع استخدام علامة الزائد (`+` / Medical Cross):** لا في الشعار ولا في الأيقونات الطبية التعبيرية (رغبة صريحة ومؤكدة لصاحب المشروع).
* ❌ **ممنوع منعاً باتاً استخدام الإيموجيات في الواجهة (Strictly NO Emojis):**
  - يمنع استخدام الإيموجيات مثل 🚚، 🔥، ☀️، 📍، 📞، 💫، ✨، 🚨 أو أي إيموجي تعبيري آخر داخل نصوص وعناوين الواجهة (UI).
  - يجب الاعتماد حصرياً على الأيقونات المتجهة الاحترافية من `lucide-react` (مثل `Truck`, `Flame`, `Sun`, `MapPin`, `Phone`, `Tag`, `ShieldCheck`) لإعطاء مظهر طبي احترافي وموثوق.
* ❌ **ممنوع استخدام أيقونة Sparkles:** لا تستخدم أيقونة `Sparkles` من `lucide-react`. بدلاً منها استخدم أيقونات متخصصة مثل:
  * `Tag` للعروض والتخفيضات.
  * `Star` للمنتجات المميزة.
  * `Heart` للعناية والجمال.
  * `Droplets` للعناية بالبشرة.
  * `Pill` للمكملات والفيتامينات.
  * `ShieldCheck` للمنتجات المضمونة والأصلية.
