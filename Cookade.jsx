import { useState, useRef, useEffect } from "react";
import {
  Plus, X, ChefHat, Clock, Zap, Timer, Flame, ArrowLeft, Utensils,
  Sparkles, Search, Heart, Share2, Settings, BookOpen, Check,
  AlertTriangle, Trash2, RefreshCw, Gift, Send, Mail, Globe,
  Users, Microwave, ChevronLeft, ChevronRight, Play, Pause, RotateCcw,
  ShoppingCart, CookingPot, Award, Smartphone,
} from "lucide-react";

const FREE_LIMIT = 5, BONUS_CREDITS = 10, GA_ID = "";
function track(ev, p = {}) { try { if (window.gtag) window.gtag("event", ev, p); } catch {} }

/* ═══ i18n (abbreviated - FR only shown, EN/ES/AR follow same keys) ═══ */
const LANGS = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "ar", label: "العربية", flag: "🇲🇦" },
];

/* Only FR shown for brevity - all 4 languages follow identical key structure */
const T = {
  fr: {
    beta: "bêta",
    /* Onboarding */
    ob_welcome: "Bienvenue sur\nCookade",
    ob_welcome_sub: "Personnalisons ton expérience en quelques secondes.",
    ob_household: "Combien êtes-vous ?",
    ob_household_sub: "Pour adapter les quantités.",
    ob_equipment: "Quel équipement as-tu ?",
    ob_equipment_sub: "On ne proposera que des recettes réalisables.",
    ob_skill: "Ton niveau en cuisine ?",
    ob_skill_sub: "Pour adapter la complexité des recettes.",
    ob_skill_beginner: "Débutant",ob_skill_beginner_d: "Les bases, simple et efficace",
    ob_skill_intermediate: "Intermédiaire",ob_skill_intermediate_d: "À l'aise avec la plupart des recettes",
    ob_skill_advanced: "Avancé",ob_skill_advanced_d: "Les défis ne me font pas peur",
    ob_start: "C'est parti !",
    ob_next: "Suivant", ob_back: "Retour",
    ob_oven: "Four", ob_stovetop: "Plaques", ob_microwave: "Micro-ondes", ob_blender: "Blender", ob_processor: "Robot", ob_airfryer: "Air fryer",
    /* Main */
    ingredients_title: "Qu'y a-t-il\ndans ton frigo ?",
    ingredients_sub: "Prends en photo ou ajoute tes ingrédients.",
    scan_btn: "📸 Scanner mon frigo",
    scan_reading: "Lecture de la photo…", scan_analyzing: "Analyse des ingrédients…",
    scan_error: "Erreur lors de l'analyse.", scan_none: "Aucun ingrédient détecté.",
    scan_found: (n) => `${n} ingrédients détectés !`,
    add_placeholder: "Ajouter un ingrédient…",
    quick_add: "Ajout rapide", clear_all: "Tout effacer",
    continue_with: (n) => `Continuer avec ${n} ingrédient${n > 1 ? "s" : ""}`,
    /* Servings */
    servings_title: "Pour combien\nde personnes ?",
    servings_sub: "Les quantités seront adaptées.",
    /* Tempo */
    tempo_title: "Combien de temps\nas-tu devant toi ?",
    tempo_sub: "On adapte les recettes à ton rythme.",
    tempo_fast: "Express", tempo_fast_sub: "≤ 15 min", tempo_fast_desc: "Prêt en un éclair",
    tempo_medium: "Classique", tempo_medium_sub: "15–45 min", tempo_medium_desc: "Le juste milieu",
    tempo_slow: "Prendre son temps", tempo_slow_sub: "45 min +", tempo_slow_desc: "Cuisine avec amour",
    your_ingredients: "Tes ingrédients",
    find_recipes: "Trouver mes recettes", unlock_more: "Débloquer plus de recettes",
    /* Results */
    chef_thinking: "Le chef réfléchit…", oops: "Oups !", bon_appetit: "Bon appétit !",
    three_recipes: "3 recettes sur mesure pour toi.",
    analyzing: (n) => `Analyse de ${n} ingrédients…`,
    error_recipes: "Impossible de trouver des recettes.", retry: "Réessayer",
    restart: "Recommencer", other_ideas: "Autres idées", unlock: "Débloquer",
    see_recipe: "Voir la recette ↓", collapse: "Réduire ↑",
    ingredients_label: "Ingrédients", steps_label: "Préparation",
    start_cooking: "Commencer à cuisiner",
    nutrition_label: "Par portion",
    nutrition_cal: "kcal", nutrition_prot: "Prot.", nutrition_carbs: "Gluc.", nutrition_fat: "Lip.",
    swap_title: "Remplacer un ingrédient",
    swap_placeholder: "Ex : remplacer le citron par…",
    swap_btn: "Adapter la recette",
    swap_loading: "Adaptation…",
    /* Cooking mode */
    cooking_step: "Étape", cooking_of: "sur", cooking_done: "Bon appétit ! 🎉",
    cooking_finish: "Terminer", cooking_prev: "Préc.", cooking_next: "Suiv.",
    /* Shopping list */
    shopping_title: "Liste de courses",
    shopping_sub: "Ce qu'il te manque pour cette recette.",
    shopping_empty: "Tu as tout ce qu'il faut !",
    shopping_add: "Ajouter à ma liste",
    shopping_list: "Ma liste",
    shopping_clear: "Vider la liste",
    shopping_copied: "Liste copiée !",
    shopping_copy: "Copier la liste",
    /* Favorites */
    fav_title: "Mes favoris",
    fav_saved: (n) => `${n} recette${n > 1 ? "s" : ""} sauvegardée${n > 1 ? "s" : ""}`,
    fav_empty: "Aucune recette sauvegardée.",
    fav_empty_msg: "Tes recettes favorites apparaîtront ici.",
    fav_find: "Trouver des recettes",
    fav_added: "Ajouté aux favoris ♥", fav_removed: "Retiré des favoris",
    copied: "Recette copiée !",
    /* History */
    history_title: "Historique", history_sub: "Tes recherches précédentes.",
    history_empty: "Aucun historique.", history_empty_msg: "Ton historique apparaîtra ici.",
    history_clear: "Effacer l'historique", history_cleared: "Historique effacé",
    /* Account */
    account_title: "Mon compte", account_beta: "Version bêta",
    account_remaining: (n) => `${n} recette${n !== 1 ? "s" : ""} restante${n !== 1 ? "s" : ""}`,
    account_exhausted: "Recettes épuisées", account_usage: "Utilisation",
    account_survey_done: "✅ Questionnaire complété — merci !",
    account_unlock_btn: "Répondre et débloquer 10 recettes",
    stats_title: "Statistiques",
    stats_proposed: "Recettes proposées", stats_favorites: "Recettes en favoris", stats_searches: "Recherches",
    /* Nav */
    nav_cook: "Cuisiner", nav_fav: "Favoris", nav_shop: "Courses", nav_account: "Compte",
    /* Prefs */
    prefs_title: "Préférences alimentaires", prefs_sub: "Les recettes respecteront ces contraintes.",
    prefs_reset: "Réinitialiser", prefs_lang: "Langue", prefs_profile: "Modifier mon profil",
    /* Usage bar */
    remaining_bar: (n) => `🍽️ ${n} recette${n > 1 ? "s" : ""} restante${n > 1 ? "s" : ""}`,
    remaining_exhausted: "Toutes les recettes utilisées",
    remaining_answer: "Réponds au questionnaire pour continuer",
    remaining_all_done: "La version complète arrive bientôt !",
    /* Survey */
    survey_title: "Cookade est en mode test",
    survey_sub: "Réponds à ces questions rapides et débloque 10 recettes gratuites supplémentaires.",
    survey_q1: "Recommanderiez-vous Cookade ?", survey_q1_sub: "1 = pas du tout · 5 = absolument",
    survey_q1_fb: ["", "Merci pour ton honnêteté", "Noté !", "Pas mal !", "Super !", "On adore ! 🎉"],
    survey_q2: "Combien seriez-vous prêt à payer par mois ?",
    survey_q3: "Reste informé du lancement", survey_q3_sub: "Optionnel — on te préviendra.",
    survey_q4: "Une suggestion ?", survey_q4_sub: "Optionnel.", survey_q4_placeholder: "Ce que j'aimerais…",
    survey_next: "Suivant", survey_back: "Retour", survey_submit: "Débloquer mes recettes",
    survey_thanks: "Merci ! 10 recettes débloquées 🎉",
    price_no: "Je ne paierais pas", price_499: "4,99€ / mois", price_799: "7,99€ / mois",
    /* AI */
    ai_lang: "en français",
    ai_tempo_fast: "15 minutes maximum", ai_tempo_medium: "entre 15 et 45 minutes", ai_tempo_slow: "45 minutes ou plus",
    ai_skill: { beginner: "débutant", intermediate: "intermédiaire", advanced: "avancé" },
    diet: { vegetarien: "Végétarien", vegan: "Végan", sans_gluten: "Sans gluten", sans_lactose: "Sans lactose", halal: "Halal", sans_noix: "Sans noix", sans_porc: "Sans porc", pescetarien: "Pescétarien" },
    quick: ["Pâtes", "Riz", "Œufs", "Poulet", "Tomates", "Oignon", "Ail", "Crème", "Fromage", "Pommes de terre", "Beurre", "Courgettes", "Poivrons", "Saumon", "Lait"],
    persons: "pers.",
  },
  en: {
    beta:"beta",ob_welcome:"Welcome to\nCookade",ob_welcome_sub:"Let's personalize your experience in seconds.",ob_household:"How many are you?",ob_household_sub:"To adapt quantities.",ob_equipment:"What equipment do you have?",ob_equipment_sub:"We'll only suggest feasible recipes.",ob_skill:"Your cooking level?",ob_skill_sub:"To adapt recipe complexity.",ob_skill_beginner:"Beginner",ob_skill_beginner_d:"The basics, simple and effective",ob_skill_intermediate:"Intermediate",ob_skill_intermediate_d:"Comfortable with most recipes",ob_skill_advanced:"Advanced",ob_skill_advanced_d:"Challenges don't scare me",ob_start:"Let's go!",ob_next:"Next",ob_back:"Back",ob_oven:"Oven",ob_stovetop:"Stovetop",ob_microwave:"Microwave",ob_blender:"Blender",ob_processor:"Food processor",ob_airfryer:"Air fryer",ingredients_title:"What's in\nyour fridge?",ingredients_sub:"Take a photo or add your ingredients.",scan_btn:"📸 Scan my fridge",scan_reading:"Reading photo…",scan_analyzing:"Analyzing ingredients…",scan_error:"Error during analysis.",scan_none:"No ingredients detected.",scan_found:(n)=>`${n} ingredients detected!`,add_placeholder:"Add an ingredient…",quick_add:"Quick add",clear_all:"Clear all",continue_with:(n)=>`Continue with ${n} ingredient${n>1?"s":""}`,servings_title:"How many\npeople?",servings_sub:"Quantities will be adapted.",tempo_title:"How much time\ndo you have?",tempo_sub:"We'll adapt recipes to your pace.",tempo_fast:"Express",tempo_fast_sub:"≤ 15 min",tempo_fast_desc:"Ready in a flash",tempo_medium:"Classic",tempo_medium_sub:"15–45 min",tempo_medium_desc:"The sweet spot",tempo_slow:"Take your time",tempo_slow_sub:"45 min +",tempo_slow_desc:"Cook with love",your_ingredients:"Your ingredients",find_recipes:"Find my recipes",unlock_more:"Unlock more recipes",chef_thinking:"The chef is thinking…",oops:"Oops!",bon_appetit:"Enjoy your meal!",three_recipes:"3 tailor-made recipes for you.",analyzing:(n)=>`Analyzing ${n} ingredients…`,error_recipes:"Couldn't find recipes.",retry:"Retry",restart:"Start over",other_ideas:"More ideas",unlock:"Unlock",see_recipe:"See recipe ↓",collapse:"Collapse ↑",ingredients_label:"Ingredients",steps_label:"Instructions",start_cooking:"Start cooking",nutrition_label:"Per serving",nutrition_cal:"kcal",nutrition_prot:"Prot.",nutrition_carbs:"Carbs",nutrition_fat:"Fat",swap_title:"Swap an ingredient",swap_placeholder:"E.g. replace lemon with…",swap_btn:"Adapt recipe",swap_loading:"Adapting…",cooking_step:"Step",cooking_of:"of",cooking_done:"Enjoy! 🎉",cooking_finish:"Finish",cooking_prev:"Prev",cooking_next:"Next",shopping_title:"Shopping list",shopping_sub:"What you need for this recipe.",shopping_empty:"You have everything!",shopping_add:"Add to my list",shopping_list:"My list",shopping_clear:"Clear list",shopping_copied:"List copied!",shopping_copy:"Copy list",fav_title:"My favorites",fav_saved:(n)=>`${n} recipe${n>1?"s":""} saved`,fav_empty:"No saved recipes.",fav_empty_msg:"Your favorite recipes will appear here.",fav_find:"Find recipes",fav_added:"Added to favorites ♥",fav_removed:"Removed from favorites",copied:"Recipe copied!",history_title:"History",history_sub:"Your previous searches.",history_empty:"No history.",history_empty_msg:"Your history will appear here.",history_clear:"Clear history",history_cleared:"History cleared",account_title:"My account",account_beta:"Beta version",account_remaining:(n)=>`${n} recipe${n!==1?"s":""} remaining`,account_exhausted:"Recipes exhausted",account_usage:"Usage",account_survey_done:"✅ Survey completed — thank you!",account_unlock_btn:"Answer & unlock 10 recipes",stats_title:"Statistics",stats_proposed:"Recipes proposed",stats_favorites:"Saved favorites",stats_searches:"Searches",nav_cook:"Cook",nav_fav:"Favorites",nav_shop:"Shop",nav_account:"Account",prefs_title:"Dietary preferences",prefs_sub:"Recipes will respect these constraints.",prefs_reset:"Reset",prefs_lang:"Language",prefs_profile:"Edit my profile",remaining_bar:(n)=>`🍽️ ${n} recipe${n>1?"s":""} remaining`,remaining_exhausted:"All recipes used",remaining_answer:"Answer the survey to continue",remaining_all_done:"Full version coming soon!",survey_title:"Cookade is in test mode",survey_sub:"Answer these quick questions and unlock 10 extra free recipes.",survey_q1:"Would you recommend Cookade?",survey_q1_sub:"1 = not at all · 5 = absolutely",survey_q1_fb:["","Thanks for your honesty","Noted!","Not bad!","Great!","We love it! 🎉"],survey_q2:"How much would you pay per month?",survey_q3:"Stay informed",survey_q3_sub:"Optional — we'll notify you.",survey_q4:"Any suggestion?",survey_q4_sub:"Optional.",survey_q4_placeholder:"What I'd love to see…",survey_next:"Next",survey_back:"Back",survey_submit:"Unlock my recipes",survey_thanks:"Thanks! 10 recipes unlocked 🎉",price_no:"I wouldn't pay",price_499:"€4.99/month",price_799:"€7.99/month",ai_lang:"in English",ai_tempo_fast:"15 minutes maximum",ai_tempo_medium:"between 15 and 45 minutes",ai_tempo_slow:"45 minutes or more",ai_skill:{beginner:"beginner",intermediate:"intermediate",advanced:"advanced"},diet:{vegetarien:"Vegetarian",vegan:"Vegan",sans_gluten:"Gluten-free",sans_lactose:"Lactose-free",halal:"Halal",sans_noix:"Nut-free",sans_porc:"Pork-free",pescetarien:"Pescatarian"},quick:["Pasta","Rice","Eggs","Chicken","Tomatoes","Onion","Garlic","Cream","Cheese","Potatoes","Butter","Zucchini","Bell peppers","Salmon","Milk"],persons:"ppl",
  },
  es: {
    beta:"beta",ob_welcome:"Bienvenido a\nCookade",ob_welcome_sub:"Personalicemos tu experiencia en segundos.",ob_household:"¿Cuántos sois?",ob_household_sub:"Para adaptar las cantidades.",ob_equipment:"¿Qué equipamiento tienes?",ob_equipment_sub:"Solo propondremos recetas realizables.",ob_skill:"¿Tu nivel de cocina?",ob_skill_sub:"Para adaptar la complejidad.",ob_skill_beginner:"Principiante",ob_skill_beginner_d:"Lo básico, simple y eficaz",ob_skill_intermediate:"Intermedio",ob_skill_intermediate_d:"Cómodo con la mayoría de recetas",ob_skill_advanced:"Avanzado",ob_skill_advanced_d:"Los retos no me asustan",ob_start:"¡Vamos!",ob_next:"Siguiente",ob_back:"Atrás",ob_oven:"Horno",ob_stovetop:"Vitrocerámica",ob_microwave:"Microondas",ob_blender:"Batidora",ob_processor:"Robot de cocina",ob_airfryer:"Freidora de aire",ingredients_title:"¿Qué hay\nen tu nevera?",ingredients_sub:"Haz una foto o añade ingredientes.",scan_btn:"📸 Escanear mi nevera",scan_reading:"Leyendo foto…",scan_analyzing:"Analizando ingredientes…",scan_error:"Error en el análisis.",scan_none:"No se detectaron ingredientes.",scan_found:(n)=>`¡${n} ingredientes detectados!`,add_placeholder:"Añadir ingrediente…",quick_add:"Añadir rápido",clear_all:"Borrar todo",continue_with:(n)=>`Continuar con ${n} ingrediente${n>1?"s":""}`,servings_title:"¿Para cuántas\npersonas?",servings_sub:"Las cantidades se adaptarán.",tempo_title:"¿Cuánto tiempo\ntienes?",tempo_sub:"Adaptamos las recetas a tu ritmo.",tempo_fast:"Exprés",tempo_fast_sub:"≤ 15 min",tempo_fast_desc:"Listo al instante",tempo_medium:"Clásico",tempo_medium_sub:"15–45 min",tempo_medium_desc:"El punto justo",tempo_slow:"Sin prisas",tempo_slow_sub:"45 min +",tempo_slow_desc:"Cocina con amor",your_ingredients:"Tus ingredientes",find_recipes:"Encontrar recetas",unlock_more:"Desbloquear más",chef_thinking:"El chef piensa…",oops:"¡Ups!",bon_appetit:"¡Buen provecho!",three_recipes:"3 recetas a tu medida.",analyzing:(n)=>`Analizando ${n} ingredientes…`,error_recipes:"No se encontraron recetas.",retry:"Reintentar",restart:"Empezar de nuevo",other_ideas:"Más ideas",unlock:"Desbloquear",see_recipe:"Ver receta ↓",collapse:"Cerrar ↑",ingredients_label:"Ingredientes",steps_label:"Preparación",start_cooking:"Empezar a cocinar",nutrition_label:"Por porción",nutrition_cal:"kcal",nutrition_prot:"Prot.",nutrition_carbs:"Carbs",nutrition_fat:"Grasas",swap_title:"Sustituir un ingrediente",swap_placeholder:"Ej: sustituir limón por…",swap_btn:"Adaptar receta",swap_loading:"Adaptando…",cooking_step:"Paso",cooking_of:"de",cooking_done:"¡Buen provecho! 🎉",cooking_finish:"Terminar",cooking_prev:"Ant.",cooking_next:"Sig.",shopping_title:"Lista de compras",shopping_sub:"Lo que necesitas para esta receta.",shopping_empty:"¡Tienes todo!",shopping_add:"Añadir a mi lista",shopping_list:"Mi lista",shopping_clear:"Vaciar lista",shopping_copied:"¡Lista copiada!",shopping_copy:"Copiar lista",fav_title:"Mis favoritos",fav_saved:(n)=>`${n} receta${n>1?"s":""} guardada${n>1?"s":""}`,fav_empty:"Sin recetas guardadas.",fav_empty_msg:"Tus favoritas aparecerán aquí.",fav_find:"Buscar recetas",fav_added:"Añadido a favoritos ♥",fav_removed:"Eliminado de favoritos",copied:"¡Receta copiada!",history_title:"Historial",history_sub:"Búsquedas anteriores.",history_empty:"Sin historial.",history_empty_msg:"Tu historial aparecerá aquí.",history_clear:"Borrar historial",history_cleared:"Historial borrado",account_title:"Mi cuenta",account_beta:"Versión beta",account_remaining:(n)=>`${n} receta${n!==1?"s":""} restante${n!==1?"s":""}`,account_exhausted:"Recetas agotadas",account_usage:"Uso",account_survey_done:"✅ Encuesta completada — ¡gracias!",account_unlock_btn:"Responder y desbloquear 10",stats_title:"Estadísticas",stats_proposed:"Recetas propuestas",stats_favorites:"Favoritas",stats_searches:"Búsquedas",nav_cook:"Cocinar",nav_fav:"Favoritos",nav_shop:"Compras",nav_account:"Cuenta",prefs_title:"Preferencias alimentarias",prefs_sub:"Las recetas respetarán estas restricciones.",prefs_reset:"Restablecer",prefs_lang:"Idioma",prefs_profile:"Editar mi perfil",remaining_bar:(n)=>`🍽️ ${n} receta${n>1?"s":""} restante${n>1?"s":""}`,remaining_exhausted:"Todas las recetas usadas",remaining_answer:"Responde la encuesta para continuar",remaining_all_done:"¡Versión completa próximamente!",survey_title:"Cookade en modo test",survey_sub:"Responde y desbloquea 10 recetas extra.",survey_q1:"¿Recomendarías Cookade?",survey_q1_sub:"1 = para nada · 5 = seguro",survey_q1_fb:["","Gracias","¡Anotado!","¡Nada mal!","¡Genial!","¡Nos encanta! 🎉"],survey_q2:"¿Cuánto pagarías al mes?",survey_q3:"Mantente informado",survey_q3_sub:"Opcional.",survey_q4:"¿Sugerencia?",survey_q4_sub:"Opcional.",survey_q4_placeholder:"Lo que me gustaría…",survey_next:"Siguiente",survey_back:"Atrás",survey_submit:"Desbloquear recetas",survey_thanks:"¡Gracias! 10 recetas desbloqueadas 🎉",price_no:"No pagaría",price_499:"4,99€/mes",price_799:"7,99€/mes",ai_lang:"en español",ai_tempo_fast:"15 minutos máximo",ai_tempo_medium:"entre 15 y 45 minutos",ai_tempo_slow:"45 minutos o más",ai_skill:{beginner:"principiante",intermediate:"intermedio",advanced:"avanzado"},diet:{vegetarien:"Vegetariano",vegan:"Vegano",sans_gluten:"Sin gluten",sans_lactose:"Sin lactosa",halal:"Halal",sans_noix:"Sin frutos secos",sans_porc:"Sin cerdo",pescetarien:"Pescetariano"},quick:["Pasta","Arroz","Huevos","Pollo","Tomates","Cebolla","Ajo","Nata","Queso","Patatas","Mantequilla","Calabacín","Pimientos","Salmón","Leche"],persons:"pers.",
  },
  ar: {
    beta:"تجريبي",ob_welcome:"مرحباً بك في\nCookade",ob_welcome_sub:"دعنا نخصص تجربتك في ثوانٍ.",ob_household:"كم عدد الأشخاص؟",ob_household_sub:"لتعديل الكميات.",ob_equipment:"ما المعدات لديك؟",ob_equipment_sub:"سنقترح فقط وصفات ممكنة.",ob_skill:"مستواك في الطبخ؟",ob_skill_sub:"لتعديل مستوى الوصفات.",ob_skill_beginner:"مبتدئ",ob_skill_beginner_d:"الأساسيات ببساطة",ob_skill_intermediate:"متوسط",ob_skill_intermediate_d:"مرتاح مع معظم الوصفات",ob_skill_advanced:"متقدم",ob_skill_advanced_d:"التحديات لا تخيفني",ob_start:"هيا بنا!",ob_next:"التالي",ob_back:"رجوع",ob_oven:"فرن",ob_stovetop:"موقد",ob_microwave:"ميكرويف",ob_blender:"خلاط",ob_processor:"روبوت مطبخ",ob_airfryer:"قلاية هوائية",ingredients_title:"ماذا يوجد\nفي ثلاجتك؟",ingredients_sub:"صوّر أو أضف مكوناتك.",scan_btn:"📸 مسح ثلاجتي",scan_reading:"قراءة الصورة…",scan_analyzing:"تحليل المكونات…",scan_error:"خطأ في التحليل.",scan_none:"لم يتم اكتشاف مكونات.",scan_found:(n)=>`تم اكتشاف ${n} مكونات!`,add_placeholder:"أضف مكوناً…",quick_add:"إضافة سريعة",clear_all:"مسح الكل",continue_with:(n)=>`متابعة مع ${n} مكون${n>1?"ات":""}`,servings_title:"لكم\nشخص؟",servings_sub:"ستُعدّل الكميات.",tempo_title:"كم من الوقت\nلديك؟",tempo_sub:"سنكيف الوصفات.",tempo_fast:"سريع",tempo_fast_sub:"≤ 15 دقيقة",tempo_fast_desc:"جاهز فوراً",tempo_medium:"عادي",tempo_medium_sub:"15–45 دقيقة",tempo_medium_desc:"الوسط الذهبي",tempo_slow:"خذ وقتك",tempo_slow_sub:"+45 دقيقة",tempo_slow_desc:"اطبخ بحب",your_ingredients:"مكوناتك",find_recipes:"ابحث عن وصفاتي",unlock_more:"افتح المزيد",chef_thinking:"الشيف يفكر…",oops:"عذراً!",bon_appetit:"بالصحة والعافية!",three_recipes:"3 وصفات مخصصة لك.",analyzing:(n)=>`تحليل ${n} مكونات…`,error_recipes:"تعذر العثور على وصفات.",retry:"إعادة المحاولة",restart:"البدء من جديد",other_ideas:"أفكار أخرى",unlock:"فتح",see_recipe:"عرض الوصفة ↓",collapse:"إغلاق ↑",ingredients_label:"المكونات",steps_label:"التحضير",start_cooking:"ابدأ الطبخ",nutrition_label:"لكل حصة",nutrition_cal:"سعرة",nutrition_prot:"بروتين",nutrition_carbs:"كربوهيدرات",nutrition_fat:"دهون",swap_title:"استبدال مكون",swap_placeholder:"مثال: استبدل الليمون بـ…",swap_btn:"تعديل الوصفة",swap_loading:"جاري التعديل…",cooking_step:"خطوة",cooking_of:"من",cooking_done:"بالصحة والعافية! 🎉",cooking_finish:"إنهاء",cooking_prev:"السابق",cooking_next:"التالي",shopping_title:"قائمة التسوق",shopping_sub:"ما تحتاجه لهذه الوصفة.",shopping_empty:"لديك كل شيء!",shopping_add:"أضف لقائمتي",shopping_list:"قائمتي",shopping_clear:"تفريغ القائمة",shopping_copied:"تم نسخ القائمة!",shopping_copy:"نسخ القائمة",fav_title:"مفضلاتي",fav_saved:(n)=>`${n} وصفات محفوظة`,fav_empty:"لا توجد وصفات محفوظة.",fav_empty_msg:"ستظهر مفضلاتك هنا.",fav_find:"ابحث عن وصفات",fav_added:"أُضيف للمفضلة ♥",fav_removed:"أُزيل من المفضلة",copied:"تم نسخ الوصفة!",history_title:"السجل",history_sub:"عمليات البحث السابقة.",history_empty:"لا يوجد سجل.",history_empty_msg:"سيظهر سجلك هنا.",history_clear:"مسح السجل",history_cleared:"تم مسح السجل",account_title:"حسابي",account_beta:"نسخة تجريبية",account_remaining:(n)=>`${n} وصفات متبقية`,account_exhausted:"نفدت الوصفات",account_usage:"الاستخدام",account_survey_done:"✅ تم الاستبيان — شكراً!",account_unlock_btn:"أجب وافتح 10 وصفات",stats_title:"الإحصائيات",stats_proposed:"وصفات مقترحة",stats_favorites:"مفضلة",stats_searches:"عمليات بحث",nav_cook:"اطبخ",nav_fav:"المفضلة",nav_shop:"التسوق",nav_account:"الحساب",prefs_title:"التفضيلات الغذائية",prefs_sub:"ستحترم الوصفات هذه القيود.",prefs_reset:"إعادة تعيين",prefs_lang:"اللغة",prefs_profile:"تعديل ملفي",remaining_bar:(n)=>`🍽️ ${n} وصفات متبقية`,remaining_exhausted:"تم استخدام الكل",remaining_answer:"أجب على الاستبيان",remaining_all_done:"النسخة الكاملة قادمة!",survey_title:"Cookade في وضع الاختبار",survey_sub:"أجب وافتح 10 وصفات إضافية.",survey_q1:"هل توصي بـ Cookade؟",survey_q1_sub:"1 = أبداً · 5 = بالتأكيد",survey_q1_fb:["","شكراً لصراحتك","تم!","ليس سيئاً!","رائع!","نحب ذلك! 🎉"],survey_q2:"كم ستدفع شهرياً؟",survey_q3:"ابق على اطلاع",survey_q3_sub:"اختياري.",survey_q4:"اقتراح؟",survey_q4_sub:"اختياري.",survey_q4_placeholder:"ما أود رؤيته…",survey_next:"التالي",survey_back:"رجوع",survey_submit:"افتح وصفاتي",survey_thanks:"شكراً! 10 وصفات 🎉",price_no:"لن أدفع",price_499:"4,99€/شهر",price_799:"7,99€/شهر",ai_lang:"بالعربية",ai_tempo_fast:"15 دقيقة كحد أقصى",ai_tempo_medium:"بين 15 و 45 دقيقة",ai_tempo_slow:"45 دقيقة أو أكثر",ai_skill:{beginner:"مبتدئ",intermediate:"متوسط",advanced:"متقدم"},diet:{vegetarien:"نباتي",vegan:"نباتي صرف",sans_gluten:"خالٍ من الغلوتين",sans_lactose:"خالٍ من اللاكتوز",halal:"حلال",sans_noix:"خالٍ من المكسرات",sans_porc:"بدون خنزير",pescetarien:"بيسكتاريان"},quick:["معكرونة","أرز","بيض","دجاج","طماطم","بصل","ثوم","كريمة","جبن","بطاطس","زبدة","كوسة","فلفل","سلمون","حليب"],persons:"أشخاص",
  },
};

const DIET_IDS = ["vegetarien","vegan","sans_gluten","sans_lactose","halal","sans_noix","sans_porc","pescetarien"];
const DIET_EMOJI = {vegetarien:"🥬",vegan:"🌱",sans_gluten:"🌾",sans_lactose:"🥛",halal:"☪️",sans_noix:"🥜",sans_porc:"🐷",pescetarien:"🐟"};
const EQUIP_IDS = ["oven","stovetop","microwave","blender","processor","airfryer"];
const EQUIP_EMOJI = {oven:"🔥",stovetop:"♨️",microwave:"📡",blender:"🥤",processor:"⚙️",airfryer:"💨"};
const PRICE_IDS = ["no","4.99","7.99"];
const PRICE_EMOJI = {no:"🙅","4.99":"👍","7.99":"💎"};

function detectLang() { try { const n = (navigator.language||"fr").toLowerCase(); if(n.startsWith("ar"))return"ar"; if(n.startsWith("en"))return"en"; if(n.startsWith("es"))return"es"; return"fr"; } catch{return"fr";} }

async function loadData(k,fb){try{const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}catch{return fb;}}
async function saveData(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}}

/* ─── Cooking Mode ─── */
function CookingMode({ recipe, t, isRtl, onClose }) {
  const [step, setStep] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerLeft, setTimerLeft] = useState(0);
  const steps = recipe.steps || [];
  const total = steps.length;
  const done = step >= total;

  /* Extract timer from step text */
  const extractTimer = (text) => {
    const m = text.match(/(\d+)\s*(min|minute|minutes|mn|دقيقة|دقائق|minuto|minutos)/i);
    return m ? parseInt(m[1]) * 60 : null;
  };
  const currentTimer = !done ? extractTimer(steps[step]) : null;

  useEffect(() => {
    if (!timerActive || timerLeft <= 0) return;
    const iv = setInterval(() => setTimerLeft(p => { if (p <= 1) { setTimerActive(false); return 0; } return p - 1; }), 1000);
    return () => clearInterval(iv);
  }, [timerActive, timerLeft]);

  const fmtTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;

  return (
    <div style={{ position:"fixed",inset:0,zIndex:70,background:"#FAF7F2",display:"flex",flexDirection:"column" }} dir={isRtl?"rtl":"ltr"}>
      {/* Header */}
      <div style={{ padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid #E8E3DB" }}>
        <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",color:"#2D4A3E",display:"flex",alignItems:"center",gap:6,fontSize:14,fontWeight:600 }}>
          <X size={18}/> {t.cooking_finish}
        </button>
        <span style={{ fontSize:13,color:"#8B9E93",fontWeight:600 }}>{recipe.emoji} {recipe.name}</span>
      </div>

      {/* Step content */}
      <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 28px",textAlign:"center" }}>
        {!done ? (<>
          <span style={{ fontSize:13,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:"#E8A838",marginBottom:16 }}>
            {t.cooking_step} {step+1} {t.cooking_of} {total}
          </span>
          <p style={{ fontSize:22,color:"#2C2C2C",lineHeight:1.6,fontFamily:"'DM Serif Display',Georgia,serif",maxWidth:400 }}>
            {steps[step]}
          </p>
          {/* Timer */}
          {currentTimer && (
            <div style={{ marginTop:28 }}>
              {!timerActive && timerLeft === 0 ? (
                <button onClick={() => { setTimerLeft(currentTimer); setTimerActive(true); }}
                  style={{ display:"flex",alignItems:"center",gap:8,padding:"12px 24px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#E8A838,#D4953A)",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer" }}>
                  <Play size={16}/> {currentTimer/60} min
                </button>
              ) : (
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                  <span style={{ fontSize:36,fontWeight:700,fontFamily:"'DM Serif Display',Georgia,serif",color:timerLeft<30?"#D4553A":"#2D4A3E" }}>
                    {fmtTime(timerLeft)}
                  </span>
                  <button onClick={() => setTimerActive(!timerActive)}
                    style={{ width:40,height:40,borderRadius:20,border:"none",background:"#EDF5F0",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    {timerActive ? <Pause size={16} color="#2D4A3E"/> : <Play size={16} color="#2D4A3E"/>}
                  </button>
                  <button onClick={() => { setTimerActive(false); setTimerLeft(0); }}
                    style={{ width:40,height:40,borderRadius:20,border:"none",background:"#FFF3E0",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <RotateCcw size={16} color="#E8A838"/>
                  </button>
                </div>
              )}
            </div>
          )}
        </>) : (
          <div>
            <span style={{ fontSize:64,display:"block",marginBottom:16 }}>👨‍🍳</span>
            <h2 style={{ fontFamily:"'DM Serif Display',Georgia,serif",fontSize:28,color:"#2C2C2C" }}>{t.cooking_done}</h2>
          </div>
        )}
      </div>

      {/* Progress + Nav */}
      <div style={{ padding:"16px 20px env(safe-area-inset-bottom,20px)",borderTop:"1px solid #E8E3DB" }}>
        <div style={{ height:4,background:"#E8E3DB",borderRadius:2,marginBottom:16 }}>
          <div style={{ height:4,background:"#5A9E6F",borderRadius:2,width:`${((done?total:step)/total)*100}%`,transition:"width 0.3s" }}/>
        </div>
        <div style={{ display:"flex",gap:10 }}>
          <button disabled={step===0} onClick={() => { setStep(s=>s-1); setTimerActive(false); setTimerLeft(0); }}
            style={{ flex:1,padding:"14px",borderRadius:12,border:"1px solid #E0DDD6",background:step===0?"#F5F3EE":"#fff",color:step===0?"#C5C2BB":"#2D4A3E",fontSize:15,fontWeight:600,cursor:step===0?"default":"pointer" }}>
            {t.cooking_prev}
          </button>
          {!done ? (
            <button onClick={() => { setStep(s=>s+1); setTimerActive(false); setTimerLeft(0); }}
              style={{ flex:2,padding:"14px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#2D4A3E,#3D6354)",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer" }}>
              {step===total-1 ? t.cooking_finish : t.cooking_next}
            </button>
          ) : (
            <button onClick={onClose}
              style={{ flex:2,padding:"14px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#E8A838,#D4953A)",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer" }}>
              {t.cooking_finish}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Survey Modal ─── */
function SurveyModal({t,isRtl,onClose,onComplete}){const[step,setStep]=useState(1);const[rating,setRating]=useState(0);const[price,setPrice]=useState("");const[email,setEmail]=useState("");const[suggestion,setSuggestion]=useState("");const[sub,setSub]=useState(false);const cn=step===1?rating>0:step===2?price!=="":true;const submit=()=>{setSub(true);track("survey_completed",{rating,price,has_email:!!email.trim()});setTimeout(()=>onComplete({rating,price,email:email.trim(),suggestion:suggestion.trim(),date:new Date().toISOString()}),600);};
return(<div style={{position:"fixed",inset:0,zIndex:60,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}><div dir={isRtl?"rtl":"ltr"} style={{background:"#FAF7F2",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:500,padding:"28px 24px env(safe-area-inset-bottom,24px)",position:"relative",maxHeight:"90vh",overflowY:"auto"}}><button onClick={onClose} style={{position:"absolute",top:14,[isRtl?"left":"right"]:14,background:"none",border:"none",cursor:"pointer",color:"#8B9E93"}}><X size={20}/></button><div style={{textAlign:"center",marginBottom:24}}><div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#E8A838,#D4953A)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}><Gift size={28} color="#fff"/></div><h2 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:22,color:"#2C2C2C",margin:"0 0 8px"}}>{t.survey_title}</h2><p style={{fontSize:14,color:"#6B7F73",lineHeight:1.5}}>{t.survey_sub}</p></div><div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:24}}>{[1,2,3,4].map(n=>(<div key={n} style={{width:n===step?24:8,height:8,borderRadius:4,background:n<=step?"#E8A838":"#E0DDD6",transition:"all 0.3s"}}/>))}</div>
{step===1&&<div><h3 style={{fontSize:16,fontWeight:600,color:"#2C2C2C",textAlign:"center",marginBottom:6}}>{t.survey_q1}</h3><p style={{fontSize:13,color:"#8B9E93",textAlign:"center",marginBottom:20}}>{t.survey_q1_sub}</p><div style={{display:"flex",gap:6,justifyContent:"center"}}>{[1,2,3,4,5].map(n=>(<button key={n} onClick={()=>setRating(n)} style={{background:"none",border:"none",cursor:"pointer",padding:4,fontSize:32,filter:n<=rating?"none":"grayscale(1) opacity(0.35)",transform:n<=rating?"scale(1.1)":"scale(1)",transition:"all 0.15s"}}>👨‍🍳</button>))}</div>{rating>0&&<p style={{textAlign:"center",fontSize:13,color:"#E8A838",fontWeight:600,marginTop:10}}>{t.survey_q1_fb[rating]}</p>}</div>}
{step===2&&<div><h3 style={{fontSize:16,fontWeight:600,color:"#2C2C2C",textAlign:"center",marginBottom:20}}>{t.survey_q2}</h3><div style={{display:"flex",flexDirection:"column",gap:10}}>{PRICE_IDS.map(id=>{const sel=price===id;const labels={no:t.price_no,"4.99":t.price_499,"7.99":t.price_799};return(<button key={id} onClick={()=>setPrice(id)} style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",borderRadius:14,border:sel?"2px solid #E8A838":"2px solid #E8E3DB",background:sel?"#FFF9EE":"#fff",cursor:"pointer"}}><span style={{fontSize:24}}>{PRICE_EMOJI[id]}</span><span style={{fontSize:15,fontWeight:600,color:"#2C2C2C"}}>{labels[id]}</span>{sel&&<Check size={18} color="#E8A838" style={{marginInlineStart:"auto"}}/>}</button>);})}</div></div>}
{step===3&&<div><h3 style={{fontSize:16,fontWeight:600,color:"#2C2C2C",textAlign:"center",marginBottom:8}}>{t.survey_q3}</h3><p style={{fontSize:13,color:"#8B9E93",textAlign:"center",marginBottom:20}}>{t.survey_q3_sub}</p><div style={{display:"flex",alignItems:"center",background:"#fff",borderRadius:12,border:"1px solid #E0DDD6",padding:"0 14px",gap:8}}><Mail size={16} color="#8B9E93"/><input type="email" placeholder="email@example.com" value={email} onChange={e=>setEmail(e.target.value)} style={{flex:1,border:"none",outline:"none",padding:"14px 0",fontSize:15,background:"transparent",color:"#2C2C2C",direction:"ltr"}}/></div></div>}
{step===4&&<div><h3 style={{fontSize:16,fontWeight:600,color:"#2C2C2C",textAlign:"center",marginBottom:8}}>{t.survey_q4}</h3><p style={{fontSize:13,color:"#8B9E93",textAlign:"center",marginBottom:20}}>{t.survey_q4_sub}</p><textarea value={suggestion} onChange={e=>setSuggestion(e.target.value)} placeholder={t.survey_q4_placeholder} rows={3} style={{width:"100%",border:"1px solid #E0DDD6",borderRadius:12,padding:14,fontSize:14,fontFamily:"'Inter',sans-serif",resize:"none",outline:"none",boxSizing:"border-box",color:"#2C2C2C",background:"#fff"}}/></div>}
<div style={{display:"flex",gap:10,marginTop:28}}>{step>1&&<button onClick={()=>setStep(step-1)} style={{flex:"0 0 auto",padding:"14px 20px",borderRadius:12,border:"1px solid #E0DDD6",background:"#fff",color:"#2D4A3E",fontSize:14,fontWeight:600,cursor:"pointer"}}>{t.survey_back}</button>}{step<4?<button disabled={!cn} onClick={()=>setStep(step+1)} style={{flex:1,padding:14,borderRadius:12,border:"none",background:cn?"linear-gradient(135deg,#2D4A3E,#3D6354)":"#D5D1CA",color:cn?"#fff":"#9E9A93",fontSize:15,fontWeight:600,cursor:cn?"pointer":"default"}}>{t.survey_next}</button>:<button onClick={submit} disabled={sub} style={{flex:1,padding:14,borderRadius:12,border:"none",background:"linear-gradient(135deg,#E8A838,#D4953A)",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>{sub?<RefreshCw size={16} style={{animation:"spin 1s linear infinite"}}/>:<><Send size={16}/> {t.survey_submit}</>}</button>}</div></div></div>);}

/* ═══ MAIN APP ═══ */
export default function Cookade() {
  const [lang,setLang]=useState("fr");const[screen,setScreen]=useState("loading");
  const[ingredients,setIngredients]=useState([]);const[inputValue,setInputValue]=useState("");
  const[diets,setDiets]=useState([]);const[tempo,setTempo]=useState(null);const[servings,setServings]=useState(4);
  const[recipes,setRecipes]=useState([]);const[favorites,setFavorites]=useState([]);
  const[history,setHistory]=useState([]);const[shoppingList,setShoppingList]=useState([]);
  const[loading,setLoading]=useState(false);const[scanning,setScanning]=useState(false);
  const[scanMsg,setScanMsg]=useState("");const[error,setError]=useState(null);
  const[showPrefs,setShowPrefs]=useState(false);const[toast,setToast]=useState(null);
  const[ready,setReady]=useState(false);const[usageCount,setUsageCount]=useState(0);
  const[surveyDone,setSurveyDone]=useState(false);const[surveyResponses,setSurveyResponses]=useState([]);
  const[showSurvey,setShowSurvey]=useState(false);const[cookingRecipe,setCookingRecipe]=useState(null);
  /* Onboarding states */
  const[obStep,setObStep]=useState(0);
  const[obHousehold,setObHousehold]=useState(2);
  const[obEquip,setObEquip]=useState(["oven","stovetop"]);
  const[obSkill,setObSkill]=useState("intermediate");
  /* Profile */
  const[profile,setProfile]=useState({household:2,equipment:["oven","stovetop"],skill:"intermediate",onboarded:false});
  const inputRef=useRef(null);

  const t=T[lang]||T.fr;const isRtl=lang==="ar";
  const totalAllowed=FREE_LIMIT+(surveyDone?BONUS_CREDITS:0);
  const remaining=Math.max(0,totalAllowed-usageCount);
  const canGenerate=usageCount<totalAllowed;

  useEffect(()=>{(async()=>{
    const[f,h,d,ing,usage,survey,resp,savedLang,prof,shop]=await Promise.all([
      loadData("sm-fav",[]),loadData("sm-hist",[]),loadData("sm-diets",[]),loadData("sm-ing",[]),
      loadData("sm-usage",0),loadData("sm-survey",false),loadData("sm-responses",[]),loadData("sm-lang",null),
      loadData("sm-profile",{household:2,equipment:["oven","stovetop"],skill:"intermediate",onboarded:false}),
      loadData("sm-shop",[]),
    ]);
    setFavorites(f);setHistory(h);setDiets(d);if(ing.length)setIngredients(ing);
    setUsageCount(usage);setSurveyDone(survey);setSurveyResponses(resp);
    setLang(savedLang||detectLang());setProfile(prof);setShoppingList(shop);setServings(prof.household||2);
    setObHousehold(prof.household||2);setObEquip(prof.equipment||["oven","stovetop"]);setObSkill(prof.skill||"intermediate");
    setScreen(prof.onboarded?"ingredients":"onboarding");setReady(true);
  })();},[]);

  useEffect(()=>{if(ready)saveData("sm-fav",favorites);},[favorites,ready]);
  useEffect(()=>{if(ready)saveData("sm-diets",diets);},[diets,ready]);
  useEffect(()=>{if(ready)saveData("sm-ing",ingredients);},[ingredients,ready]);
  useEffect(()=>{if(ready)saveData("sm-hist",history);},[history,ready]);
  useEffect(()=>{if(ready)saveData("sm-usage",usageCount);},[usageCount,ready]);
  useEffect(()=>{if(ready)saveData("sm-survey",surveyDone);},[surveyDone,ready]);
  useEffect(()=>{if(ready)saveData("sm-responses",surveyResponses);},[surveyResponses,ready]);
  useEffect(()=>{if(ready)saveData("sm-lang",lang);},[lang,ready]);
  useEffect(()=>{if(ready)saveData("sm-profile",profile);},[profile,ready]);
  useEffect(()=>{if(ready)saveData("sm-shop",shoppingList);},[shoppingList,ready]);

  useEffect(()=>{if(!GA_ID)return;const s=document.createElement("script");s.src=`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;s.async=true;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments);};window.gtag("js",new Date());window.gtag("config",GA_ID);},[]);

  const showToast=(m)=>{setToast(m);setTimeout(()=>setToast(null),2500);};
  const addIngredient=(n)=>{const x=n.trim();if(x&&!ingredients.find(i=>i.toLowerCase()===x.toLowerCase()))setIngredients(p=>[...p,x]);};
  const removeIngredient=(n)=>setIngredients(p=>p.filter(i=>i!==n));
  const toggleDiet=(id)=>setDiets(p=>p.includes(id)?p.filter(d=>d!==id):[...p,id]);
  const isFav=(r)=>favorites.some(f=>f.name===r.name);
  const toggleFav=(r)=>{if(isFav(r)){setFavorites(p=>p.filter(f=>f.name!==r.name));showToast(t.fav_removed);}else{setFavorites(p=>[...p,r]);showToast(t.fav_added);}};
  const shareRecipe=async(r)=>{const txt=`🍽️ ${r.name}\n${r.description}\n\n${t.ingredients_label}:\n${r.ingredients?.map(i=>`• ${i}`).join("\n")||""}\n\n${t.steps_label}:\n${r.steps?.map((s,i)=>`${i+1}. ${s}`).join("\n")||""}\n\n— Cookade`;if(navigator.share){try{await navigator.share({title:r.name,text:txt});}catch{}}else{try{await navigator.clipboard.writeText(txt);showToast(t.copied);}catch{}}};

  /* Shopping list: add missing ingredients from a recipe */
  const addMissing=(recipe)=>{
    const have=ingredients.map(i=>i.toLowerCase());
    const missing=(recipe.ingredients||[]).filter(ing=>{
      const name=ing.replace(/\d+\s*(g|kg|ml|l|cl|c\.?\s*à\s*s|c\.?\s*à\s*c|cs|cc|cuillère|cup|tbsp|tsp|oz|pièce|tranche)s?\b/gi,"").replace(/^\W+/,"").trim().toLowerCase();
      return!have.some(h=>name.includes(h.toLowerCase())||h.toLowerCase().includes(name.split(" ")[0]));
    });
    if(missing.length===0){showToast(t.shopping_empty);return;}
    setShoppingList(p=>{const existing=p.map(x=>x.toLowerCase());const newItems=missing.filter(m=>!existing.includes(m.toLowerCase()));return[...p,...newItems];});
    showToast(`${missing.length} ${t.shopping_add}`);
  };

  /* Photo scan */
  const handlePhoto=async(e)=>{
    const file=e.target.files?.[0];const el=e.target;if(!file)return;
    track("photo_scan");setScanning(true);setScanMsg(t.scan_reading);
    try{
      const b64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=()=>rej();r.readAsDataURL(file);});
      setScanMsg(t.scan_analyzing);
      const resp=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:file.type||"image/jpeg",data:b64}},{type:"text",text:`List ONLY visible food ingredients. JSON without backticks: {"ingredients":["name1"]}. Names ${t.ai_lang}. No food: {"ingredients":[],"error":"${t.scan_none}"}`}]}]})});
      const data=await resp.json();const txt=data.content.map(c=>c.text||"").filter(Boolean).join("");
      const parsed=JSON.parse(txt.replace(/```json|```/g,"").trim());
      if(parsed.error)showToast(parsed.error);
      else if(parsed.ingredients?.length){parsed.ingredients.forEach(i=>addIngredient(i));showToast(t.scan_found(parsed.ingredients.length));}
      else showToast(t.scan_none);
    }catch{showToast(t.scan_error);}
    finally{setScanning(false);setScanMsg("");try{el.value="";}catch{}}
  };

  /* Generate */
  const tempoAI=(id)=>id==="fast"?t.ai_tempo_fast:id==="medium"?t.ai_tempo_medium:t.ai_tempo_slow;
  /* Swap ingredient */
  const[swapIdx,setSwapIdx]=useState(null);
  const[swapText,setSwapText]=useState("");
  const[swapping,setSwapping]=useState(false);
  const handleSwap=async(recipeIdx)=>{
    if(!swapText.trim())return;setSwapping(true);
    try{
      const r=recipes[recipeIdx];
      const prompt=`Here is a recipe in JSON:\n${JSON.stringify(r)}\n\nThe user wants: "${swapText}"\n\nAdapt the recipe accordingly. Keep the same JSON structure. All text ${t.ai_lang}. Return ONLY valid JSON, no backticks.`;
      const resp=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:2048,messages:[{role:"user",content:prompt}]})});
      const data=await resp.json();const txt=data.content.map(c=>c.text||"").filter(Boolean).join("");
      const parsed=JSON.parse(txt.replace(/```json|```/g,"").trim());
      setRecipes(prev=>{const n=[...prev];n[recipeIdx]=parsed;return n;});
      setSwapIdx(null);setSwapText("");showToast("✅");
    }catch{showToast(t.scan_error);}finally{setSwapping(false);}
  };

  const handleGenerate=()=>{if(!canGenerate){track("survey_shown",{usage:usageCount,done:surveyDone});if(!surveyDone)setShowSurvey(true);else showToast(t.remaining_all_done);return;}fetchRecipes();};

  const fetchRecipes=async()=>{
    track("recipe_search",{ingredients_count:ingredients.length,tempo,servings,usage:usageCount+1});
    setLoading(true);setError(null);setScreen("results");
    const dietLabels=diets.map(id=>t.diet[id]).filter(Boolean);
    const dietLine=dietLabels.length?`\nDietary constraints: ${dietLabels.join(", ")}.`:"";
    const equipLine=profile.equipment.length?`\nAvailable equipment: ${profile.equipment.map(e=>t[`ob_${e}`]).join(", ")}.`:"";
    const prompt=`You are a creative chef. Available ingredients:\n${ingredients.join(", ")}\n\nTime: ${tempoAI(tempo)}.\nServings: ${servings} people.\nSkill: ${t.ai_skill[profile.skill]||"intermediate"}.${equipLine}${dietLine}\n\nPropose 3 recipes. All text ${t.ai_lang}. JSON only, no backticks:\n[{"name":"","type":"","time":"X min","difficulty":"","emoji":"","description":"","ingredients":["qty + name for ${servings} servings"],"steps":["detailed"],"conseil":"chef tip","nutrition":{"calories":0,"protein":0,"carbs":0,"fat":0}}]\nNutrition = estimated per serving in kcal/g.`;
    try{
      const resp=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:4096,messages:[{role:"user",content:prompt}]})});
      const data=await resp.json();const txt=data.content.map(c=>c.text||"").filter(Boolean).join("");
      const parsed=JSON.parse(txt.replace(/```json|```/g,"").trim());
      setRecipes(parsed);setUsageCount(p=>p+1);
      setHistory(p=>[{date:new Date().toISOString(),ingredients:[...ingredients],tempo,servings,diets:[...diets],recipes:parsed},...p].slice(0,20));
    }catch{setError(t.error_recipes);}finally{setLoading(false);}
  };

  const reset=()=>{setScreen("ingredients");setTempo(null);setRecipes([]);setError(null);};

  if(!ready||screen==="loading")return(<div style={{minHeight:"100vh",background:"#FAF7F2",display:"flex",alignItems:"center",justifyContent:"center"}}><ChefHat size={36} color="#2D4A3E" style={{animation:"pulse 1.5s infinite"}}/><style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}`}</style></div>);

  /* ═══ ONBOARDING ═══ */
  if(screen==="onboarding"){
    const toggleEquip=(id)=>setObEquip(p=>p.includes(id)?p.filter(e=>e!==id):[...p,id]);
    const finishOb=()=>{const p={household:obHousehold,equipment:obEquip,skill:obSkill,onboarded:true};setProfile(p);setServings(obHousehold);setScreen("ingredients");};
    const skillOpts=[{id:"beginner",icon:"🥚",label:t.ob_skill_beginner,desc:t.ob_skill_beginner_d},{id:"intermediate",icon:"🍳",label:t.ob_skill_intermediate,desc:t.ob_skill_intermediate_d},{id:"advanced",icon:"👨‍🍳",label:t.ob_skill_advanced,desc:t.ob_skill_advanced_d}];

    return(
      <div dir={isRtl?"rtl":"ltr"} style={{minHeight:"100vh",background:"#FAF7F2",fontFamily:"'Inter',sans-serif",padding:"0 24px"}}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
        <div style={{maxWidth:500,margin:"0 auto",paddingTop:60,paddingBottom:40}}>
          {/* Progress */}
          <div style={{display:"flex",gap:6,marginBottom:32}}>{[0,1,2].map(n=>(<div key={n} style={{flex:1,height:4,borderRadius:2,background:n<=obStep?"#2D4A3E":"#E0DDD6",transition:"all 0.3s"}}/>))}</div>

          {/* Lang selector on first step */}
          {obStep===0&&<div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:32}}>{LANGS.map(l=>(<button key={l.code} onClick={()=>setLang(l.code)} style={{padding:"6px 12px",borderRadius:8,border:lang===l.code?"2px solid #2D4A3E":"1px solid #E0DDD6",background:lang===l.code?"#EDF5F0":"#fff",cursor:"pointer",fontSize:13}}>{l.flag} {l.label}</button>))}</div>}

          {obStep===0&&(<div style={{textAlign:"center"}}>
            <div style={{width:72,height:72,borderRadius:20,background:"linear-gradient(135deg,#2D4A3E,#5A9E6F)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}><ChefHat size={36} color="#fff"/></div>
            <h1 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:32,color:"#2C2C2C",margin:"0 0 8px",whiteSpace:"pre-line"}}>{t.ob_welcome}</h1>
            <p style={{fontSize:15,color:"#6B7F73",marginBottom:32}}>{t.ob_welcome_sub}</p>
            <h3 style={{fontSize:16,fontWeight:600,color:"#2C2C2C",marginBottom:6}}>{t.ob_household}</h3>
            <p style={{fontSize:13,color:"#8B9E93",marginBottom:20}}>{t.ob_household_sub}</p>
            <div style={{display:"flex",justifyContent:"center",gap:10}}>{[1,2,3,4,5,6].map(n=>(<button key={n} onClick={()=>setObHousehold(n)} style={{width:48,height:48,borderRadius:14,border:obHousehold===n?"2px solid #2D4A3E":"2px solid #E8E3DB",background:obHousehold===n?"#EDF5F0":"#fff",color:"#2C2C2C",fontSize:18,fontWeight:600,cursor:"pointer"}}>{n}</button>))}</div>
          </div>)}

          {obStep===1&&(<div>
            <h2 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:26,color:"#2C2C2C",margin:"0 0 6px",textAlign:"center"}}>{t.ob_equipment}</h2>
            <p style={{fontSize:14,color:"#8B9E93",textAlign:"center",marginBottom:24}}>{t.ob_equipment_sub}</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{EQUIP_IDS.map(id=>{const a=obEquip.includes(id);return(<button key={id} onClick={()=>toggleEquip(id)} style={{padding:"16px",borderRadius:14,border:a?"2px solid #2D4A3E":"2px solid #E8E3DB",background:a?"#EDF5F0":"#fff",cursor:"pointer",textAlign:"center"}}><span style={{fontSize:28,display:"block",marginBottom:6}}>{EQUIP_EMOJI[id]}</span><span style={{fontSize:14,fontWeight:600,color:"#2C2C2C"}}>{t[`ob_${id}`]}</span>{a&&<Check size={14} color="#2D4A3E" style={{marginTop:4}}/>}</button>);})}</div>
          </div>)}

          {obStep===2&&(<div>
            <h2 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:26,color:"#2C2C2C",margin:"0 0 6px",textAlign:"center"}}>{t.ob_skill}</h2>
            <p style={{fontSize:14,color:"#8B9E93",textAlign:"center",marginBottom:24}}>{t.ob_skill_sub}</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>{skillOpts.map(opt=>{const sel=obSkill===opt.id;return(<button key={opt.id} onClick={()=>setObSkill(opt.id)} style={{display:"flex",alignItems:"center",gap:14,padding:"18px",borderRadius:14,border:sel?"2px solid #2D4A3E":"2px solid #E8E3DB",background:sel?"#EDF5F0":"#fff",cursor:"pointer",textAlign:isRtl?"right":"left"}}><span style={{fontSize:32}}>{opt.icon}</span><div><div style={{fontSize:15,fontWeight:600,color:"#2C2C2C"}}>{opt.label}</div><div style={{fontSize:13,color:"#6B7F73"}}>{opt.desc}</div></div>{sel&&<Check size={18} color="#2D4A3E" style={{marginInlineStart:"auto"}}/>}</button>);})}</div>
          </div>)}

          {/* Nav buttons */}
          <div style={{display:"flex",gap:10,marginTop:32}}>
            {obStep>0&&<button onClick={()=>setObStep(obStep-1)} style={{flex:"0 0 auto",padding:"14px 20px",borderRadius:12,border:"1px solid #E0DDD6",background:"#fff",color:"#2D4A3E",fontSize:14,fontWeight:600,cursor:"pointer"}}>{t.ob_back}</button>}
            {obStep<2?<button onClick={()=>setObStep(obStep+1)} style={{flex:1,padding:"14px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#2D4A3E,#3D6354)",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer"}}>{t.ob_next}</button>
            :<button onClick={finishOb} style={{flex:1,padding:"14px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#E8A838,#D4953A)",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><Sparkles size={16}/> {t.ob_start}</button>}
          </div>
        </div>
      </div>
    );
  }

  /* ═══ MAIN UI ═══ */
  const tempoOpts=[{id:"fast",label:t.tempo_fast,subtitle:t.tempo_fast_sub,desc:t.tempo_fast_desc,icon:Zap,color:"#E8A838"},{id:"medium",label:t.tempo_medium,subtitle:t.tempo_medium_sub,desc:t.tempo_medium_desc,icon:Timer,color:"#5A9E6F"},{id:"slow",label:t.tempo_slow,subtitle:t.tempo_slow_sub,desc:t.tempo_slow_desc,icon:Flame,color:"#D4553A"}];
  const navItems=[{id:"ingredients",label:t.nav_cook,icon:Utensils},{id:"favorites",label:t.nav_fav,icon:Heart},{id:"shopping",label:t.nav_shop,icon:ShoppingCart},{id:"account",label:t.nav_account,icon:Gift}];

  return(
    <div dir={isRtl?"rtl":"ltr"} style={{minHeight:"100vh",background:"#FAF7F2",fontFamily:"'Inter',sans-serif",paddingBottom:80}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateX(-50%) translateY(-10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}`}</style>

      {cookingRecipe&&<CookingMode recipe={cookingRecipe} t={t} isRtl={isRtl} onClose={()=>setCookingRecipe(null)}/>}
      {showSurvey&&<SurveyModal t={t} isRtl={isRtl} onClose={()=>{track("survey_dismissed");setShowSurvey(false);}} onComplete={(r)=>{setSurveyDone(true);setSurveyResponses(p=>[...p,r]);setShowSurvey(false);showToast(t.survey_thanks);}}/>}
      {toast&&<div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",zIndex:100,background:"#2D4A3E",color:"#fff",padding:"12px 24px",borderRadius:12,fontSize:14,fontWeight:500,boxShadow:"0 8px 32px rgba(0,0,0,0.2)",animation:"fadeIn 0.3s ease",whiteSpace:"nowrap",zIndex:80}}>{toast}</div>}

      {/* Header */}
      <header style={{padding:"18px 20px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {!["ingredients","favorites","shopping","account"].includes(screen)&&<button onClick={()=>setScreen(screen==="results"?"tempo":screen==="tempo"?"servings":screen==="servings"?"ingredients":"ingredients")} style={{background:"none",border:"none",cursor:"pointer",padding:4,color:"#2D4A3E",display:"flex"}}><ArrowLeft size={22}/></button>}
          <div style={{width:32,height:32,borderRadius:9,background:"linear-gradient(135deg,#2D4A3E,#5A9E6F)",display:"flex",alignItems:"center",justifyContent:"center"}}><ChefHat size={17} color="#fff"/></div>
          <span style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:20,color:"#2D4A3E"}}>Cookade</span>
          <span style={{background:"linear-gradient(135deg,#E8A838,#D4953A)",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:6,textTransform:"uppercase"}}>{t.beta}</span>
        </div>
        <button onClick={()=>setShowPrefs(!showPrefs)} style={{background:showPrefs?"#2D4A3E":"none",border:"1px solid #D5D1CA",borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:showPrefs?"#fff":"#6B7F73"}}><Settings size={17}/></button>
      </header>

      {/* Usage bar */}
      {["ingredients","servings","tempo"].includes(screen)&&<div style={{margin:"10px 20px 0",padding:"10px 16px",background:remaining>2?"#EDF5F0":remaining>0?"#FFF9EE":"#FFF3E0",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"space-between",border:remaining>2?"1px solid #C8DFD0":"1px solid #F0D4A8"}}><span style={{fontSize:13,color:remaining>0?"#2D4A3E":"#8B6914",fontWeight:500}}>{remaining>0?t.remaining_bar(remaining):surveyDone?t.remaining_exhausted:t.remaining_answer}</span>{remaining===0&&!surveyDone&&<button onClick={()=>{track("survey_shown",{source:"bar"});setShowSurvey(true);}} style={{background:"linear-gradient(135deg,#E8A838,#D4953A)",border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",padding:"5px 12px",borderRadius:8}}>{t.unlock}</button>}</div>}

      {/* Prefs */}
      {showPrefs&&<div style={{margin:"10px 20px",padding:18,background:"#fff",borderRadius:14,border:"1px solid #E8E3DB",boxShadow:"0 4px 16px rgba(0,0,0,0.06)"}}>
        <h3 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:17,color:"#2C2C2C",margin:"0 0 3px"}}>{t.prefs_title}</h3>
        <p style={{fontSize:13,color:"#8B9E93",marginBottom:12}}>{t.prefs_sub}</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>{DIET_IDS.map(id=>{const a=diets.includes(id);return(<button key={id} onClick={()=>toggleDiet(id)} style={{display:"inline-flex",alignItems:"center",gap:5,background:a?"#2D4A3E":"#fff",color:a?"#fff":"#4A5E52",padding:"9px 14px",borderRadius:50,fontSize:13,fontWeight:500,border:a?"1px solid #2D4A3E":"1px solid #E0DDD6",cursor:"pointer"}}><span>{DIET_EMOJI[id]}</span>{t.diet[id]}{a&&<Check size={13}/>}</button>);})}</div>
        {diets.length>0&&<button onClick={()=>setDiets([])} style={{background:"none",border:"none",color:"#D4553A",fontSize:13,fontWeight:500,cursor:"pointer",marginBottom:14,display:"block"}}>{t.prefs_reset}</button>}
        <div style={{borderTop:"1px solid #F0EDE7",paddingTop:14,marginBottom:14}}>
          <p style={{fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:1.2,color:"#8B9E93",marginBottom:8}}>{t.prefs_lang}</p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{LANGS.map(l=>(<button key={l.code} onClick={()=>setLang(l.code)} style={{padding:"6px 12px",borderRadius:8,border:lang===l.code?"2px solid #2D4A3E":"1px solid #E0DDD6",background:lang===l.code?"#EDF5F0":"#fff",cursor:"pointer",fontSize:13}}>{l.flag} {l.label}</button>))}</div>
        </div>
        <button onClick={()=>{setScreen("onboarding");setShowPrefs(false);}} style={{fontSize:13,color:"#5A9E6F",fontWeight:600,background:"none",border:"none",cursor:"pointer"}}>{t.prefs_profile}</button>
      </div>}

      <main style={{padding:"10px 20px 20px",maxWidth:600,margin:"0 auto"}}>
        {/* INGREDIENTS */}
        {screen==="ingredients"&&<div>
          <div style={{marginTop:14,marginBottom:24}}><h1 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:28,fontWeight:400,color:"#2C2C2C",margin:0,lineHeight:1.2,whiteSpace:"pre-line"}}>{t.ingredients_title}</h1><p style={{fontSize:14,color:"#6B7F73",marginTop:7}}>{t.ingredients_sub}</p></div>
          <div style={{position:"relative",width:"100%",marginBottom:14}}><div style={{width:"100%",padding:"16px",borderRadius:14,border:"2px dashed #C8DFD0",background:scanning?"rgba(237,245,240,0.8)":"rgba(237,245,240,0.5)",display:"flex",alignItems:"center",justifyContent:"center",gap:8,color:"#2D4A3E",fontSize:15,fontWeight:600,boxSizing:"border-box"}}>{scanning?<><RefreshCw size={18} style={{animation:"spin 1s linear infinite"}}/>{scanMsg}</>:t.scan_btn}</div>{!scanning&&<input type="file" accept="image/*" onChange={handlePhoto} style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:0,cursor:"pointer",zIndex:2}}/>}</div>
          <div style={{display:"flex",gap:8,marginBottom:14}}><div style={{flex:1,display:"flex",alignItems:"center",background:"#fff",borderRadius:12,border:"1px solid #E0DDD6",padding:"0 12px",gap:6}}><Search size={15} color="#8B9E93"/><input ref={inputRef} type="text" placeholder={t.add_placeholder} value={inputValue} onChange={e=>setInputValue(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){addIngredient(inputValue);setInputValue("");}}} style={{flex:1,border:"none",outline:"none",padding:"13px 0",fontSize:15,background:"transparent",color:"#2C2C2C"}}/></div><button onClick={()=>{if(inputValue.trim()){addIngredient(inputValue);setInputValue("");inputRef.current?.focus();}}} style={{width:46,height:46,borderRadius:12,border:"none",background:"#2D4A3E",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Plus size={18}/></button></div>
          {ingredients.length>0&&<><div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:8}}>{ingredients.map(ing=>(<span key={ing} style={{display:"inline-flex",alignItems:"center",gap:5,background:"#EDF5F0",color:"#2D4A3E",padding:"7px 13px",borderRadius:50,fontSize:13,fontWeight:500,border:"1px solid #C8DFD0"}}>{ing}<button onClick={()=>removeIngredient(ing)} style={{background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",color:"#8BA898"}}><X size={13}/></button></span>))}</div><button onClick={()=>setIngredients([])} style={{background:"none",border:"none",color:"#D4553A",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:4,marginBottom:16}}><Trash2 size={12}/> {t.clear_all}</button></>}
          <div style={{marginBottom:24}}><p style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:1.2,color:"#8B9E93",marginBottom:8}}>{t.quick_add}</p><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{t.quick.filter(s=>!ingredients.find(i=>i.toLowerCase()===s.toLowerCase())).map(s=>(<button key={s} onClick={()=>addIngredient(s)} style={{background:"#fff",border:"1px solid #E0DDD6",borderRadius:50,padding:"6px 13px",fontSize:12,color:"#4A5E52",cursor:"pointer"}}>+ {s}</button>))}</div></div>
          <button disabled={ingredients.length<2} onClick={()=>setScreen("servings")} style={{width:"100%",padding:"15px",borderRadius:14,border:"none",background:ingredients.length>=2?"linear-gradient(135deg,#2D4A3E,#3D6354)":"#D5D1CA",color:ingredients.length>=2?"#fff":"#9E9A93",fontSize:15,fontWeight:600,cursor:ingredients.length>=2?"pointer":"default"}}>{t.continue_with(ingredients.length)}</button>
        </div>}

        {/* SERVINGS */}
        {screen==="servings"&&<div>
          <div style={{marginTop:14,marginBottom:28}}><h1 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:28,fontWeight:400,color:"#2C2C2C",margin:0,lineHeight:1.2,whiteSpace:"pre-line"}}>{t.servings_title}</h1><p style={{fontSize:14,color:"#6B7F73",marginTop:7}}>{t.servings_sub}</p></div>
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:20,marginBottom:32}}>
            <button onClick={()=>setServings(Math.max(1,servings-1))} style={{width:48,height:48,borderRadius:14,border:"1px solid #E0DDD6",background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#2D4A3E"}}>−</button>
            <div style={{textAlign:"center"}}><span style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:56,color:"#2C2C2C"}}>{servings}</span><p style={{fontSize:14,color:"#8B9E93",margin:0}}>{t.persons}</p></div>
            <button onClick={()=>setServings(Math.min(12,servings+1))} style={{width:48,height:48,borderRadius:14,border:"1px solid #E0DDD6",background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#2D4A3E"}}>+</button>
          </div>
          <button onClick={()=>setScreen("tempo")} style={{width:"100%",padding:"15px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#2D4A3E,#3D6354)",color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer"}}>{t.ob_next}</button>
        </div>}

        {/* TEMPO */}
        {screen==="tempo"&&<div>
          <div style={{marginTop:14,marginBottom:24}}><h1 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:28,fontWeight:400,color:"#2C2C2C",margin:0,lineHeight:1.2,whiteSpace:"pre-line"}}>{t.tempo_title}</h1><p style={{fontSize:14,color:"#6B7F73",marginTop:7}}>{t.tempo_sub}</p></div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>{tempoOpts.map(opt=>{const Icon=opt.icon;const sel=tempo===opt.id;return(<button key={opt.id} onClick={()=>setTempo(opt.id)} style={{display:"flex",alignItems:"center",gap:14,padding:"16px",borderRadius:14,border:sel?`2px solid ${opt.color}`:"2px solid #E8E3DB",background:sel?`${opt.color}0D`:"#fff",cursor:"pointer",textAlign:isRtl?"right":"left"}}><div style={{width:44,height:44,borderRadius:12,background:sel?`${opt.color}20`:"#F5F3EE",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon size={20} color={sel?opt.color:"#8B9E93"}/></div><div><div style={{fontSize:15,fontWeight:600,color:"#2C2C2C"}}>{opt.label}<span style={{fontSize:13,fontWeight:400,color:"#8B9E93",marginInlineStart:6}}>{opt.subtitle}</span></div><div style={{fontSize:13,color:"#6B7F73",marginTop:1}}>{opt.desc}</div></div></button>);})}</div>
          <div style={{background:"#fff",borderRadius:12,padding:"12px 16px",border:"1px solid #E8E3DB",marginBottom:18}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:1.2,color:"#8B9E93"}}>{t.your_ingredients}</span><span style={{fontSize:13,color:"#5A9E6F",fontWeight:600}}>{servings} {t.persons}</span></div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{ingredients.map(ing=>(<span key={ing} style={{background:"#EDF5F0",color:"#2D4A3E",padding:"4px 11px",borderRadius:50,fontSize:12,fontWeight:500}}>{ing}</span>))}</div>
          </div>
          <button disabled={!tempo} onClick={handleGenerate} style={{width:"100%",padding:"15px",borderRadius:14,border:"none",background:tempo?(canGenerate?"linear-gradient(135deg,#E8A838,#D4953A)":"linear-gradient(135deg,#2D4A3E,#3D6354)"):"#D5D1CA",color:tempo?"#fff":"#9E9A93",fontSize:15,fontWeight:600,cursor:tempo?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>{canGenerate?<><Sparkles size={17}/> {t.find_recipes}</>:<><Gift size={17}/> {t.unlock_more}</>}</button>
        </div>}

        {/* RESULTS */}
        {screen==="results"&&<div>
          <div style={{marginTop:14,marginBottom:20}}><h1 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:25,fontWeight:400,color:"#2C2C2C",margin:0}}>{loading?t.chef_thinking:error?t.oops:t.bon_appetit}</h1>{!loading&&!error&&<p style={{fontSize:14,color:"#6B7F73",marginTop:5}}>{t.three_recipes}</p>}</div>
          {loading&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:18,padding:"50px 0"}}><div style={{width:60,height:60,borderRadius:18,background:"linear-gradient(135deg,#EDF5F0,#D8EBDE)",display:"flex",alignItems:"center",justifyContent:"center",animation:"pulse 1.5s infinite"}}><Utensils size={26} color="#2D4A3E" style={{animation:"spin 2s linear infinite"}}/></div><p style={{fontSize:14,color:"#6B7F73"}}>{t.analyzing(ingredients.length)}</p></div>}
          {error&&<div style={{textAlign:"center",padding:"40px 0"}}><AlertTriangle size={38} color="#D4553A" style={{marginBottom:14}}/><p style={{fontSize:14,color:"#D4553A",marginBottom:18}}>{error}</p><button onClick={fetchRecipes} style={{padding:"11px 24px",borderRadius:12,border:"none",background:"#2D4A3E",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>{t.retry}</button></div>}
          {!loading&&!error&&recipes.length>0&&<div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:24}}>
            {recipes.map((r,i)=>(<div key={i} style={{background:"#fff",borderRadius:16,overflow:"hidden",border:"1px solid #E8E3DB"}}>
              <div style={{padding:"18px 20px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={{fontSize:28}}>{r.emoji||"🍽️"}</span><span style={{fontSize:11,fontWeight:700,textTransform:"uppercase",color:"#E8A838"}}>{r.type}</span>{r.time&&<span style={{fontSize:12,color:"#8B9E93",display:"flex",alignItems:"center",gap:3}}><Clock size={12}/>{r.time}</span>}</div><h3 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:20,fontWeight:400,color:"#2C2C2C",margin:0}}>{r.name}</h3><p style={{fontSize:14,color:"#6B7F73",marginTop:4,lineHeight:1.5}}>{r.description}</p></div><div style={{display:"flex",gap:6}}><button onClick={()=>toggleFav(r)} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><Heart size={18} color={isFav(r)?"#D4553A":"#C5C2BB"} fill={isFav(r)?"#D4553A":"none"}/></button><button onClick={()=>shareRecipe(r)} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><Share2 size={16} color="#C5C2BB"/></button></div></div>
                {/* Nutrition */}
                {r.nutrition&&<div style={{display:"flex",gap:0,marginTop:12,background:"#F5F3EE",borderRadius:10,overflow:"hidden"}}>
                  {[{k:"calories",l:t.nutrition_cal,c:"#E8A838"},{k:"protein",l:t.nutrition_prot,c:"#D4553A"},{k:"carbs",l:t.nutrition_carbs,c:"#5A9E6F"},{k:"fat",l:t.nutrition_fat,c:"#8B7340"}].map((n,j)=>(
                    <div key={j} style={{flex:1,padding:"8px 4px",textAlign:"center",borderInlineEnd:j<3?"1px solid #E8E3DB":"none"}}>
                      <div style={{fontSize:15,fontWeight:700,color:n.c}}>{r.nutrition[n.k]||0}</div>
                      <div style={{fontSize:10,color:"#8B9E93",marginTop:1}}>{n.l}</div>
                    </div>))}
                </div>}
              </div>
              <div style={{padding:"0 20px 16px"}}>
                {swapIdx===i&&<div style={{marginBottom:10,display:"flex",gap:6}}><input value={swapText} onChange={e=>setSwapText(e.target.value)} placeholder={t.swap_placeholder} onKeyDown={e=>{if(e.key==="Enter")handleSwap(i);}} style={{flex:1,border:"1px solid #E0DDD6",borderRadius:8,padding:"10px 12px",fontSize:13,outline:"none",background:"#FAFAF8",color:"#2C2C2C"}}/><button onClick={()=>handleSwap(i)} disabled={swapping} style={{padding:"10px 14px",borderRadius:8,border:"none",background:"#E8A838",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>{swapping?t.swap_loading:t.swap_btn}</button></div>}
                <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setCookingRecipe(r)} style={{flex:1,padding:"12px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#2D4A3E,#3D6354)",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><CookingPot size={16}/> {t.start_cooking}</button>
                <button onClick={()=>setSwapIdx(swapIdx===i?null:i)} style={{flex:0,padding:"12px 16px",borderRadius:10,border:swapIdx===i?"1px solid #E8A838":"1px solid #E0DDD6",background:swapIdx===i?"#FFF9EE":"#fff",color:"#2D4A3E",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} title={t.swap_title}><RefreshCw size={16}/></button>
                <button onClick={()=>addMissing(r)} style={{flex:0,padding:"12px 16px",borderRadius:10,border:"1px solid #E0DDD6",background:"#fff",color:"#2D4A3E",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><ShoppingCart size={16}/></button>
                </div>
              </div>
            </div>))}
          </div>}
          {!loading&&<div style={{display:"flex",gap:8}}><button onClick={reset} style={{flex:1,padding:"13px",borderRadius:12,border:"1px solid #E0DDD6",background:"#fff",color:"#2D4A3E",fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><ArrowLeft size={15}/> {t.restart}</button>{!error&&recipes.length>0&&<button onClick={handleGenerate} style={{flex:1,padding:"13px",borderRadius:12,border:"none",background:canGenerate?"linear-gradient(135deg,#E8A838,#D4953A)":"linear-gradient(135deg,#2D4A3E,#3D6354)",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>{canGenerate?<><RefreshCw size={15}/> {t.other_ideas}</>:<><Gift size={15}/> {t.unlock}</>}</button>}</div>}
        </div>}

        {/* FAVORITES */}
        {screen==="favorites"&&<div>
          <div style={{marginTop:14,marginBottom:20}}><h1 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:26,fontWeight:400,color:"#2C2C2C",margin:0}}>{t.fav_title}</h1><p style={{fontSize:14,color:"#6B7F73",marginTop:5}}>{favorites.length?t.fav_saved(favorites.length):t.fav_empty}</p></div>
          {!favorites.length&&<div style={{textAlign:"center",padding:"44px 0"}}><Heart size={44} color="#D5D1CA" style={{marginBottom:14}}/><p style={{fontSize:14,color:"#8B9E93"}}>{t.fav_empty_msg}</p><button onClick={()=>setScreen("ingredients")} style={{marginTop:14,padding:"11px 22px",borderRadius:12,border:"none",background:"#2D4A3E",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>{t.fav_find}</button></div>}
          {favorites.length>0&&<div style={{display:"flex",flexDirection:"column",gap:14}}>{favorites.map((r,i)=>(<div key={i} style={{background:"#fff",borderRadius:14,padding:"16px 18px",border:"1px solid #E8E3DB"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><span style={{fontSize:20,marginInlineEnd:8}}>{r.emoji}</span><span style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:17,color:"#2C2C2C"}}>{r.name}</span><p style={{fontSize:13,color:"#6B7F73",marginTop:4}}>{r.description}</p></div><div style={{display:"flex",gap:6}}><button onClick={()=>setCookingRecipe(r)} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><CookingPot size={18} color="#5A9E6F"/></button><button onClick={()=>toggleFav(r)} style={{background:"none",border:"none",cursor:"pointer",padding:4}}><Heart size={18} color="#D4553A" fill="#D4553A"/></button></div></div></div>))}</div>}
        </div>}

        {/* SHOPPING */}
        {screen==="shopping"&&<div>
          <div style={{marginTop:14,marginBottom:20}}><h1 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:26,fontWeight:400,color:"#2C2C2C",margin:0}}>{t.shopping_list}</h1><p style={{fontSize:14,color:"#6B7F73",marginTop:5}}>{shoppingList.length?`${shoppingList.length} article${shoppingList.length>1?"s":""}`:t.shopping_empty}</p></div>
          {!shoppingList.length&&<div style={{textAlign:"center",padding:"44px 0"}}><ShoppingCart size={44} color="#D5D1CA" style={{marginBottom:14}}/><p style={{fontSize:14,color:"#8B9E93"}}>{t.shopping_empty}</p></div>}
          {shoppingList.length>0&&<>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>{shoppingList.map((item,i)=>(<div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",borderRadius:10,padding:"12px 16px",border:"1px solid #E8E3DB"}}><span style={{fontSize:14,color:"#2C2C2C"}}>{item}</span><button onClick={()=>setShoppingList(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",cursor:"pointer",color:"#D4553A",padding:4}}><X size={14}/></button></div>))}</div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>{const txt=shoppingList.map(i=>`☐ ${i}`).join("\n");if(navigator.clipboard){navigator.clipboard.writeText(txt);showToast(t.shopping_copied);}}} style={{flex:1,padding:"13px",borderRadius:12,border:"1px solid #E0DDD6",background:"#fff",color:"#2D4A3E",fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><Share2 size={15}/> {t.shopping_copy}</button>
              <button onClick={()=>{setShoppingList([]);showToast(t.history_cleared);}} style={{flex:1,padding:"13px",borderRadius:12,border:"none",background:"#D4553A",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>{t.shopping_clear}</button>
            </div>
          </>}
        </div>}

        {/* ACCOUNT */}
        {screen==="account"&&<div>
          <div style={{marginTop:14,marginBottom:24}}><h1 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:26,fontWeight:400,color:"#2C2C2C",margin:0}}>{t.account_title}</h1></div>
          <div style={{background:"#fff",borderRadius:16,padding:"24px 20px",marginBottom:16,border:"1px solid #E8E3DB"}}><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}><div style={{width:48,height:48,borderRadius:14,background:"#F5F3EE",display:"flex",alignItems:"center",justifyContent:"center"}}><Gift size={24} color="#E8A838"/></div><div><h3 style={{fontSize:18,fontWeight:600,margin:0,color:"#2C2C2C"}}>{t.account_beta}</h3><p style={{fontSize:13,color:"#8B9E93",margin:0}}>{remaining>0?t.account_remaining(remaining):t.account_exhausted}</p></div></div><div style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,color:"#8B9E93"}}>{t.account_usage}</span><span style={{fontSize:12,color:"#8B9E93"}}>{usageCount}/{totalAllowed}</span></div><div style={{height:6,background:"#E8E3DB",borderRadius:3}}><div style={{height:6,background:remaining>2?"#5A9E6F":"#E8A838",borderRadius:3,width:`${Math.min(100,(usageCount/totalAllowed)*100)}%`,transition:"width 0.3s"}}/></div></div>
            <div style={{fontSize:13,color:"#6B7F73"}}><span>{profile.household} {t.persons} · {t[`ob_skill_${profile.skill}`]} · {profile.equipment.map(e=>t[`ob_${e}`]).join(", ")}</span></div>
            {surveyDone&&<div style={{marginTop:12,padding:"10px 14px",background:"#EDF5F0",borderRadius:10,border:"1px solid #C8DFD0"}}><p style={{fontSize:13,color:"#2D4A3E",fontWeight:500}}>{t.account_survey_done}</p></div>}
          </div>
          {!surveyDone&&remaining===0&&<button onClick={()=>{track("survey_shown",{source:"account"});setShowSurvey(true);}} style={{width:"100%",padding:"16px",borderRadius:14,border:"none",background:"linear-gradient(135deg,#E8A838,#D4953A)",color:"#fff",fontSize:16,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:16}}><Gift size={18}/> {t.account_unlock_btn}</button>}
          <div style={{background:"#fff",borderRadius:14,padding:"18px 20px",border:"1px solid #E8E3DB"}}><h4 style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,color:"#8B9E93",marginBottom:14}}>{t.stats_title}</h4>{[{label:t.stats_proposed,value:usageCount*3},{label:t.stats_favorites,value:favorites.length},{label:t.stats_searches,value:usageCount}].map((s,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<2?"1px solid #F5F3EE":"none"}}><span style={{fontSize:14,color:"#4A5E52"}}>{s.label}</span><span style={{fontSize:14,fontWeight:600,color:"#2C2C2C"}}>{s.value}</span></div>))}</div>
        </div>}
      </main>

      {/* Nav */}
      <nav style={{position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid #E8E3DB",display:"flex",justifyContent:"center",padding:"7px 0 env(safe-area-inset-bottom,10px)",zIndex:40}}>
        {navItems.map(item=>{const Icon=item.icon;const active=screen===item.id||(item.id==="ingredients"&&["servings","tempo","results"].includes(screen));return(
          <button key={item.id} onClick={()=>{setScreen(item.id);if(item.id==="ingredients"){setTempo(null);setRecipes([]);setError(null);}}} style={{flex:1,maxWidth:100,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"7px 0",background:"none",border:"none",cursor:"pointer",color:active?"#2D4A3E":"#B0ADA6"}}>
            <div style={{position:"relative"}}><Icon size={20}/>{item.id==="favorites"&&favorites.length>0&&<span style={{position:"absolute",top:-4,[isRtl?"left":"right"]:-8,width:15,height:15,borderRadius:8,background:"#D4553A",color:"#fff",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{favorites.length}</span>}{item.id==="shopping"&&shoppingList.length>0&&<span style={{position:"absolute",top:-4,[isRtl?"left":"right"]:-8,width:15,height:15,borderRadius:8,background:"#E8A838",color:"#fff",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{shoppingList.length}</span>}</div>
            <span style={{fontSize:10,fontWeight:active?600:500}}>{item.label}</span>
          </button>);})}
      </nav>
    </div>
  );
}
