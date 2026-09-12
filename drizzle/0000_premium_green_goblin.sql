CREATE TABLE `banners` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`image` text NOT NULL,
	`link` text DEFAULT '/shop' NOT NULL,
	`active` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cart` (
	`id` text PRIMARY KEY NOT NULL,
	`user` text NOT NULL,
	`product` text NOT NULL,
	`quantity` integer NOT NULL,
	FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "cart_quantity" CHECK("cart"."quantity" BETWEEN 1 AND 99)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cart_user_product` ON `cart` (`user`,`product`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`image` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `collections` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`image` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `coupons` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`kind` text NOT NULL,
	`value` integer NOT NULL,
	`minimum` integer DEFAULT 0 NOT NULL,
	`maximum` integer DEFAULT 0 NOT NULL,
	`expires` text NOT NULL,
	`usage_limit` integer DEFAULT 100 NOT NULL,
	`used` integer DEFAULT 0 NOT NULL,
	`category` text DEFAULT '' NOT NULL,
	`product` text DEFAULT '' NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	CONSTRAINT "coupon_usage_limit" CHECK("coupons"."used" <= "coupons"."usage_limit")
);
--> statement-breakpoint
CREATE UNIQUE INDEX `coupons_code_unique` ON `coupons` (`code`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`body` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user` text,
	`kind` text NOT NULL,
	`payload` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product` text NOT NULL,
	`name` text NOT NULL,
	`sku` text NOT NULL,
	`price` integer NOT NULL,
	`quantity` integer NOT NULL,
	`image` text NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `items_order` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`user` text NOT NULL,
	`request_key` text NOT NULL,
	`created` text NOT NULL,
	`status` text NOT NULL,
	`payment_status` text NOT NULL,
	`method` text NOT NULL,
	`subtotal` integer NOT NULL,
	`shipping` integer NOT NULL,
	`discount` integer NOT NULL,
	`total` integer NOT NULL,
	`address` text NOT NULL,
	`coupon` text,
	`gateway_id` text,
	`payment_id` text,
	`demo` integer NOT NULL,
	`tracking` text DEFAULT '' NOT NULL,
	`gst_rate` integer DEFAULT 0 NOT NULL,
	`business` text DEFAULT '{}' NOT NULL,
	FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_request_key_unique` ON `orders` (`request_key`);--> statement-breakpoint
CREATE INDEX `orders_user_created` ON `orders` (`user`,`created`);--> statement-breakpoint
CREATE UNIQUE INDEX `orders_gateway` ON `orders` (`gateway_id`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`sku` text NOT NULL,
	`category` text,
	`anime` text,
	`character` text DEFAULT '' NOT NULL,
	`price` integer NOT NULL,
	`original` integer NOT NULL,
	`stock` integer NOT NULL,
	`threshold` integer DEFAULT 5 NOT NULL,
	`sold` integer DEFAULT 0 NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`specifications` text DEFAULT '' NOT NULL,
	`material` text DEFAULT '' NOT NULL,
	`dimensions` text DEFAULT '' NOT NULL,
	`weight` text DEFAULT '' NOT NULL,
	`images` text DEFAULT '[]' NOT NULL,
	`featured` integer DEFAULT 0 NOT NULL,
	`bestseller` integer DEFAULT 0 NOT NULL,
	`isnew` integer DEFAULT 0 NOT NULL,
	`demo` integer DEFAULT 1 NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`created` text NOT NULL,
	FOREIGN KEY (`category`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`anime`) REFERENCES `collections`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "stock_nonnegative" CHECK("products"."stock" >= 0),
	CONSTRAINT "price_nonnegative" CHECK("products"."price" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_sku_unique` ON `products` (`sku`);--> statement-breakpoint
CREATE INDEX `products_category` ON `products` (`category`);--> statement-breakpoint
CREATE INDEX `products_anime` ON `products` (`anime`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`user` text NOT NULL,
	`product` text NOT NULL,
	`rating` integer NOT NULL,
	`body` text NOT NULL,
	`image` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created` text NOT NULL,
	FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "rating_valid" CHECK("reviews"."rating" BETWEEN 1 AND 5)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `review_user_product` ON `reviews` (`user`,`product`);--> statement-breakpoint
CREATE INDEX `review_product_status` ON `reviews` (`product`,`status`);--> statement-breakpoint
CREATE TABLE `settings` (
	`id` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `uploads` (
	`id` text PRIMARY KEY NOT NULL,
	`user` text NOT NULL,
	`mime` text NOT NULL,
	`size` integer NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`address` text DEFAULT '{}' NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `wishlists` (
	`id` text PRIMARY KEY NOT NULL,
	`user` text NOT NULL,
	`product` text NOT NULL,
	FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wishlist_user_product` ON `wishlists` (`user`,`product`);