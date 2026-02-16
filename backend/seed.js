import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";
import foodModel from "./models/foodModel.js";
import userModel from "./models/userModel.js";

const sampleFoods = [
  { name: "Greek Salad", image: "1722865444288food_1.png", price: 12, description: "Fresh mixed greens with feta cheese, olives, tomatoes, and a tangy vinaigrette dressing", category: "Salad" },
  { name: "Veg Salad", image: "1722865514626food_2.png", price: 18, description: "A colorful blend of seasonal vegetables tossed in a light lemon herb dressing", category: "Salad" },
  { name: "Clover Salad", image: "1722865628915food_3.png", price: 16, description: "Crispy clover greens with cherry tomatoes, walnuts, and balsamic glaze", category: "Salad" },
  { name: "Chicken Salad", image: "1722865668073food_4.png", price: 24, description: "Grilled chicken breast on a bed of fresh greens with avocado and ranch dressing", category: "Salad" },
  { name: "Lasagna Rolls", image: "1722865738489food_5.png", price: 14, description: "Tender pasta rolls filled with ricotta, spinach, and topped with marinara sauce", category: "Rolls" },
  { name: "Peri Peri Rolls", image: "1722865934153food_6.png", price: 12, description: "Spicy peri peri seasoned rolls with crunchy vegetables and tangy mayo", category: "Rolls" },
  { name: "Chicken Rolls", image: "1722865976487food_7.png", price: 20, description: "Juicy chicken wrapped in soft flatbread with lettuce, onions, and special sauce", category: "Rolls" },
  { name: "Veg Rolls", image: "1722866043779food_8.png", price: 15, description: "Crispy vegetable spring rolls served with sweet chili dipping sauce", category: "Rolls" },
  { name: "Ripple Ice Cream", image: "1722866109947food_9.png", price: 14, description: "Creamy vanilla ice cream with beautiful strawberry ripple swirls", category: "Deserts" },
  { name: "Fruit Ice Cream", image: "1722866148130food_10.png", price: 22, description: "Refreshing ice cream loaded with fresh seasonal fruits and berry compote", category: "Deserts" },
  { name: "Jar Ice Cream", image: "1722866329894food_11.png", price: 10, description: "Layered ice cream served in a mason jar with cookie crumbles and chocolate drizzle", category: "Deserts" },
  { name: "Vanilla Ice Cream", image: "1722866385025food_12.png", price: 12, description: "Classic creamy vanilla bean ice cream made with real Madagascar vanilla", category: "Deserts" },
  { name: "Chicken Sandwich", image: "1722866412882food_13.png", price: 12, description: "Grilled chicken breast with lettuce, tomato, and garlic aioli on toasted bread", category: "Sandwich" },
  { name: "Vegan Sandwich", image: "1722866469319food_14.png", price: 18, description: "Plant-based patty with avocado, sprouts, and vegan chipotle sauce", category: "Sandwich" },
  { name: "Grilled Sandwich", image: "1722866504992food_15.png", price: 16, description: "Golden grilled sandwich with melted cheese, mushrooms, and caramelized onions", category: "Sandwich" },
  { name: "Bread Sandwich", image: "1722866560218food_16.png", price: 24, description: "Triple-decker club sandwich with ham, turkey, bacon, and fresh veggies", category: "Sandwich" },
  { name: "Cup Cake", image: "1722866610567food_17.png", price: 14, description: "Fluffy cupcake with rich buttercream frosting and colorful sprinkles", category: "Cake" },
  { name: "Vegan Cake", image: "1722866647952food_18.png", price: 12, description: "Moist vegan chocolate cake made with organic cocoa and coconut cream", category: "Cake" },
  { name: "Butterscotch Cake", image: "1722866694357food_19.png", price: 20, description: "Rich butterscotch layered cake with caramel drizzle and crunchy praline", category: "Cake" },
  { name: "Sliced Cake", image: "1722866729053food_20.png", price: 15, description: "Classic layered cake slice with whipped cream and fresh strawberries", category: "Cake" },
  { name: "Garlic Mushroom", image: "1722866777756food_21.png", price: 14, description: "Sautéed mushrooms in garlic butter with fresh herbs and crusty bread", category: "Pure Veg" },
  { name: "Fried Cauliflower", image: "1722866830901food_22.png", price: 22, description: "Crispy fried cauliflower florets with spicy buffalo sauce and blue cheese dip", category: "Pure Veg" },
  { name: "Mix Veg Pulao", image: "1722866871307food_23.png", price: 10, description: "Fragrant basmati rice cooked with mixed vegetables, whole spices, and saffron", category: "Pure Veg" },
  { name: "Rice Zucchini", image: "1722866909328food_24.png", price: 12, description: "Grilled zucchini served on a bed of herbed rice with sun-dried tomatoes", category: "Pure Veg" },
  { name: "Cheese Pasta", image: "1722866948105food_25.png", price: 12, description: "Creamy four-cheese pasta with parmesan, cheddar, mozzarella, and gouda", category: "Pasta" },
  { name: "Tomato Pasta", image: "1722867018540food_26.png", price: 18, description: "Al dente pasta in a rich San Marzano tomato sauce with fresh basil", category: "Pasta" },
  { name: "Creamy Pasta", image: "1722867053413food_27.png", price: 16, description: "Fettuccine in a velvety alfredo sauce with garlic bread on the side", category: "Pasta" },
  { name: "Chicken Pasta", image: "1722867110108food_28.png", price: 24, description: "Penne with grilled chicken, sun-dried tomatoes, and creamy pesto sauce", category: "Pasta" },
  { name: "Butter Noodles", image: "1722867144188food_29.png", price: 14, description: "Silky noodles tossed in golden butter with garlic, herbs, and parmesan", category: "Noodles" },
  { name: "Veg Noodles", image: "1722867222977food_30.png", price: 12, description: "Stir-fried noodles with colorful vegetables in a savory soy-ginger sauce", category: "Noodles" },
  { name: "Somen Noodles", image: "1722867254829food_31.png", price: 20, description: "Delicate Japanese somen noodles served chilled with a light dipping broth", category: "Noodles" },
  { name: "Cooked Noodles", image: "1722867630288food_32.png", price: 15, description: "Wok-tossed egg noodles with mushrooms, bok choy, and sesame glaze", category: "Noodles" },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connected for seeding...");

    // Clear existing data
    await foodModel.deleteMany({});
    console.log("Cleared existing food items.");

    // Insert sample foods
    await foodModel.insertMany(sampleFoods);
    console.log(`Inserted ${sampleFoods.length} food items.`);

    // Create admin user if not exists
    const adminExists = await userModel.findOne({ email: "admin@tomato.com" });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashedPassword = await bcrypt.hash("admin123", salt);
      await userModel.create({
        name: "Admin",
        email: "admin@tomato.com",
        password: hashedPassword,
        role: "admin",
        cartData: {},
      });
      console.log("Admin user created: admin@tomato.com / admin123");
    } else {
      console.log("Admin user already exists: admin@tomato.com");
    }

    console.log("\n=== Seeding Complete! ===");
    console.log("Admin Login: admin@tomato.com / admin123");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDB();
