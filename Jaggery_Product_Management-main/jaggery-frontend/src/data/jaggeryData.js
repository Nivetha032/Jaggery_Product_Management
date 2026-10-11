import fullVideo from "../assets/videos/jaggery_process.mp4";

// 40-second animated explainer of the whole process (regenerate with tools/make_process_video.py)
export const FULL_VIDEO = fullVideo;

// All showcase content lives here so it is easy to edit.

export const FILTERS = [
  { id: "all", label: "All" },
  { id: "jaggery", label: "Jaggery" },
  { id: "byproduct", label: "By-products" },
  { id: "treat", label: "Sweets & Treats" },
];

export const CATALOG = [
  { id: "block", type: "jaggery", icon: "🟫", name: "Jaggery Blocks (Achu Vellam)", desc: "Classic solid cakes made by slow-boiling cane juice.", uses: "Sweetener, festival sweets, traditional remedies" },
  { id: "powder", type: "jaggery", icon: "🧂", name: "Jaggery Powder", desc: "Finely ground, free-flowing and easy to measure.", uses: "Tea, coffee, baking, everyday cooking" },
  { id: "liquid", type: "jaggery", icon: "🍯", name: "Liquid Jaggery (Cane Syrup)", desc: "Thick golden syrup, stopped before it sets.", uses: "Pancakes, drinks, marinades, desserts" },
  { id: "granules", type: "jaggery", icon: "✨", name: "Granulated Jaggery", desc: "Dry golden granules with a longer shelf life.", uses: "Sugar substitute, spice mixes, porridge" },
  { id: "cubes", type: "jaggery", icon: "🧊", name: "Jaggery Cubes", desc: "Bite-size portions, ready to drop into a cup.", uses: "Tea, kashayam, after-meal sweet" },
  { id: "palm", type: "jaggery", icon: "🌴", name: "Palm Jaggery (Karupatti)", desc: "Dark, mineral-rich jaggery from palm sap.", uses: "Payasam, sweet pongal, traditional drinks" },
  { id: "coconut", type: "jaggery", icon: "🥥", name: "Coconut Jaggery", desc: "Caramel-like sweetness from coconut palm sap.", uses: "Desserts, coffee, dosa batter, ladoos" },
  { id: "date", type: "jaggery", icon: "🍂", name: "Date Palm Jaggery (Khejur Gur)", desc: "Soft, fudgy winter jaggery with a smoky note.", uses: "Winter sweets, rice kheer, spreads" },
  { id: "molasses", type: "byproduct", icon: "🫙", name: "Molasses (Kaakvi)", desc: "Dark syrup drained while the jaggery is made.", uses: "Baking, cattle feed, fermentation" },
  { id: "bagasse", type: "byproduct", icon: "🌾", name: "Bagasse", desc: "Dry fibre left after crushing the cane.", uses: "Furnace fuel, paper, eco-friendly plates" },
  { id: "pressmud", type: "byproduct", icon: "🌱", name: "Press Mud & Cane Ash", desc: "Nutrient-rich residue from clarification and fuel.", uses: "Organic compost for the next crop" },
  { id: "vinegar", type: "byproduct", icon: "🧪", name: "Cane Vinegar", desc: "Naturally fermented from surplus cane juice.", uses: "Pickling, salad dressings, cooking" },
  { id: "chikki", type: "treat", icon: "🍬", name: "Jaggery Chikki", desc: "Crunchy brittle of peanuts or sesame bound in jaggery.", uses: "Snack, gifting, festivals" },
  { id: "laddu", type: "treat", icon: "🟠", name: "Jaggery Laddu & Sweets", desc: "Handmade sweets from jaggery and natural ingredients.", uses: "Celebrations, prasadam, snacks" },
  { id: "tea", type: "treat", icon: "☕", name: "Jaggery Tea Premix", desc: "Jaggery, tea and spices blended for a quick cup.", uses: "Instant tea, travel, gifting" },
];

// 6 stages of the preparation "video"
export const STAGES = [
  { id: "harvest", icon: "🎋", anim: "sway", title: "Harvest", text: "Mature sugarcane is cut by hand at 10–12 months, stripped of leaves and carried to the mill the same day." },
  { id: "crush", icon: "⚙️", anim: "spin", title: "Crush", text: "Cane is pressed between heavy rollers. The fresh juice is strained through cloth to remove fibre." },
  { id: "boil", icon: "🍲", anim: "bubble", title: "Boil", text: "Juice simmers in large open pans for a few hours, thickening as the water evaporates." },
  { id: "clarify", icon: "🥄", anim: "stir", title: "Clarify", text: "Impurities rise as foam and are skimmed off. Traditionally, plant extracts like okra are used as natural clarifiers." },
  { id: "mould", icon: "🟫", anim: "pour", title: "Mould", text: "The thick golden syrup is poured into moulds, or stirred until it turns into powder or granules." },
  { id: "pack", icon: "📦", anim: "bounce", title: "Cool & Pack", text: "Cooled, graded and packed in eco-friendly packaging, ready for your kitchen." },
];

// OPTIONAL: plug in real preparation videos per stage.
// Put an mp4 in src/assets/videos and import it, or use a YouTube video id:
//   import crushVideo from "../assets/videos/crush.mp4";
//   export const STAGE_VIDEOS = { crush: { src: crushVideo }, boil: { youtube: "VIDEO_ID" } };
// Stages without an entry show the built-in animation.
export const STAGE_VIDEOS = {};

export const TOUR_STOPS = [
  { icon: "🌾", place: "The Cane Fields", fact: "Sugarcane grows for 10–12 months. Farmers hand-select the ripest stalks." },
  { icon: "🏭", place: "The Crushing Mill", fact: "Around 60–70% of the cane's weight comes out as juice." },
  { icon: "🔥", place: "The Boiling House", fact: "Juice is simmered in open pans over bagasse fire, so the by-product fuels the process." },
  { icon: "🟫", place: "The Moulding Yard", fact: "Hot syrup is shaped into blocks, cubes, powder or liquid jaggery." },
  { icon: "📦", place: "The Packing Hall", fact: "Each batch is graded, weighed and sealed in eco-friendly packaging." },
  { icon: "🏠", place: "Your Kitchen", fact: "From our farm to your table: pure, traditional and preservative-free." },
];
