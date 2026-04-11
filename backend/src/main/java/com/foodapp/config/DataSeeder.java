package com.foodapp.config;

import com.foodapp.model.MenuItem;
import com.foodapp.model.Restaurant;
import com.foodapp.repository.MenuItemRepository;
import com.foodapp.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    @Override
    public void run(String... args) {
        if (restaurantRepository.count() > 0) {
            log.info("Database already has data — skipping seed.");
            return;
        }

        log.info("Seeding sample restaurant and menu data...");

        // ── 1. Spice Garden ──────────────────────────────────────────────
        Restaurant spiceGarden = restaurantRepository.save(Restaurant.builder()
                .name("Spice Garden")
                .description("Authentic South Indian cuisine from the heart of Chennai. Crispy dosas, fluffy idlis, and rich curries.")
                .location("Chennai, Tamil Nadu")
                .cuisine("South Indian")
                .rating(4.5)
                .isOpen(true)
                .deliveryTime(30)
                .deliveryFee(29.0)
                .build());

        menuItemRepository.saveAll(List.of(
                menuItem("Masala Dosa", "Crispy golden dosa filled with spiced potato masala, served with coconut chutney and sambar.", 80.0, "Breakfast", 4.6, spiceGarden),
                menuItem("Idli Sambar", "Soft, fluffy steamed rice cakes served with piping hot sambar and fresh chutneys.", 60.0, "Breakfast", 4.4, spiceGarden),
                menuItem("Chicken Biryani", "Aromatic basmati rice cooked with tender chicken pieces, whole spices, and saffron.", 220.0, "Main", 4.8, spiceGarden),
                menuItem("Paneer Butter Masala", "Soft cottage cheese cubes in a rich, creamy tomato-butter gravy. Best enjoyed with naan.", 180.0, "Main", 4.5, spiceGarden),
                menuItem("Filter Coffee", "Freshly brewed strong South Indian coffee with frothy milk, an absolute classic.", 40.0, "Drinks", 4.7, spiceGarden)
        ));

        // ── 2. Burger Barn ───────────────────────────────────────────────
        Restaurant burgerBarn = restaurantRepository.save(Restaurant.builder()
                .name("Burger Barn")
                .description("Juicy, flame-grilled burgers made with 100% fresh ingredients. American fast food at its finest.")
                .location("Bangalore, Karnataka")
                .cuisine("American Fast Food")
                .rating(4.2)
                .isOpen(true)
                .deliveryTime(25)
                .deliveryFee(0.0)
                .build());

        menuItemRepository.saveAll(List.of(
                menuItem("Classic Burger", "A timeless beef patty with fresh lettuce, tomato, onion, and our signature house sauce.", 149.0, "Burgers", 4.3, burgerBarn),
                menuItem("Cheese Burger", "Our classic burger loaded with double cheddar cheese for the ultimate indulgence.", 179.0, "Burgers", 4.5, burgerBarn),
                menuItem("Crispy Fries", "Golden, extra-crispy seasoned fries. The perfect companion to any burger.", 79.0, "Sides", 4.2, burgerBarn),
                menuItem("Chicken Wrap", "Grilled chicken strips with crisp veggies and garlic mayo wrapped in a soft flour tortilla.", 159.0, "Wraps", 4.4, burgerBarn),
                menuItem("Cola Drink", "Chilled, refreshing cola to wash down your favourite burger. Available in regular size.", 49.0, "Drinks", 4.0, burgerBarn)
        ));

        // ── 3. Pizza Palace ──────────────────────────────────────────────
        Restaurant pizzaPalace = restaurantRepository.save(Restaurant.builder()
                .name("Pizza Palace")
                .description("Authentic Italian wood-fired pizzas, handmade pasta and indulgent desserts. Buon appetito!")
                .location("Mumbai, Maharashtra")
                .cuisine("Italian, Pizzas")
                .rating(4.7)
                .isOpen(true)
                .deliveryTime(40)
                .deliveryFee(49.0)
                .build());

        menuItemRepository.saveAll(List.of(
                menuItem("Margherita Pizza", "Classic Neapolitan pizza with San Marzano tomato sauce, fresh mozzarella, and basil.", 299.0, "Pizza", 4.6, pizzaPalace),
                menuItem("Pepperoni Pizza", "Generous layers of spicy pepperoni on a rich tomato base with melted mozzarella.", 349.0, "Pizza", 4.8, pizzaPalace),
                menuItem("Garlic Bread", "Toasted baguette slices brushed with herb butter and roasted garlic. Simply irresistible.", 99.0, "Sides", 4.3, pizzaPalace),
                menuItem("Pasta Arrabbiata", "Penne pasta tossed in a fiery tomato sauce with chillies, garlic, and fresh parsley.", 249.0, "Pasta", 4.4, pizzaPalace),
                menuItem("Tiramisu", "Classic Italian dessert with layers of espresso-soaked ladyfingers and mascarpone cream.", 149.0, "Desserts", 4.7, pizzaPalace)
        ));

        // ── 4. Dragon Wok ────────────────────────────────────────────────
        Restaurant dragonWok = restaurantRepository.save(Restaurant.builder()
                .name("Dragon Wok")
                .description("Bold and vibrant Chinese cuisine. Wok-tossed noodles, fried rice, and classic Indo-Chinese favourites.")
                .location("Hyderabad, Telangana")
                .cuisine("Chinese Cuisine")
                .rating(4.3)
                .isOpen(true)
                .deliveryTime(35)
                .deliveryFee(39.0)
                .build());

        menuItemRepository.saveAll(List.of(
                menuItem("Veg Fried Rice", "Fragrant wok-tossed rice with fresh vegetables, soy sauce, and sesame oil.", 160.0, "Rice", 4.2, dragonWok),
                menuItem("Chicken Noodles", "Stir-fried egg noodles with succulent chicken strips, peppers, and house sauce.", 190.0, "Noodles", 4.5, dragonWok),
                menuItem("Manchurian", "Crispy fried vegetable balls tossed in a tangy, spicy Manchurian sauce.", 140.0, "Starters", 4.4, dragonWok),
                menuItem("Spring Rolls", "Crispy golden rolls stuffed with seasoned vegetables and glass noodles.", 120.0, "Starters", 4.3, dragonWok),
                menuItem("Hot & Sour Soup", "A warming, umami-rich broth with mushrooms, tofu, and a spicy-sour kick.", 110.0, "Soups", 4.1, dragonWok)
        ));

        // ── 5. Green Bowl ────────────────────────────────────────────────
        Restaurant greenBowl = restaurantRepository.save(Restaurant.builder()
                .name("Green Bowl")
                .description("Wholesome, nutritious and delicious. Fresh salads, power bowls, and healthy snacks for a guilt-free meal.")
                .location("Pune, Maharashtra")
                .cuisine("Healthy, Salads")
                .rating(4.1)
                .isOpen(true)
                .deliveryTime(20)
                .deliveryFee(0.0)
                .build());

        menuItemRepository.saveAll(List.of(
                menuItem("Caesar Salad", "Crisp romaine lettuce, house Caesar dressing, parmesan shavings, and crunchy croutons.", 199.0, "Salads", 4.3, greenBowl),
                menuItem("Quinoa Bowl", "Protein-packed quinoa with roasted veggies, chickpeas, feta, and a lemon-herb drizzle.", 249.0, "Bowls", 4.5, greenBowl),
                menuItem("Avocado Toast", "Thick-cut whole-grain toast topped with smashed avocado, Everything Bagel seasoning, and cherry tomatoes.", 179.0, "Breakfast", 4.4, greenBowl),
                menuItem("Detox Juice", "A vibrant blend of cucumber, celery, spinach, ginger, and lemon. Cleanse and refresh!", 129.0, "Drinks", 4.2, greenBowl),
                menuItem("Fruit Parfait", "Layers of creamy Greek yogurt, honey-granola, and fresh seasonal fruits.", 149.0, "Desserts", 4.1, greenBowl)
        ));

        log.info("Successfully seeded 5 restaurants with 25 menu items.");
    }

    private MenuItem menuItem(String name, String description, Double price, String category, Double rating, Restaurant restaurant) {
        return MenuItem.builder()
                .name(name)
                .description(description)
                .price(price)
                .category(category)
                .rating(rating)
                .isAvailable(true)
                .restaurant(restaurant)
                .build();
    }
}
