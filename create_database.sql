drop database online_restaurant;
create database online_restaurant;
use online_restaurant;
create table pizza_components(
	pizzaId int not null auto_increment,
    kind ENUM ('crust', 'cheese', 'sauces', 'meats', 'toppings') not null,
	component_Name varchar(20) not null,
    price decimal(5,2) not null,
    amounts SET('0','0.5','1','2') NULL, 
    CONSTRAINT PK_Pizza PRIMARY KEY (pizzaId)
);

create table users(
	userId int not null auto_increment,
    userFName varchar(20) not null,
    userMName varchar(20) null,
    userLName varchar(20) not null,
    userEmail varchar(50) not null, 	-- need validation on both ends, used as user name
	street VARCHAR(255) NOT NULL,
	city VARCHAR(100) NOT NULL,
	state VARCHAR(50) not null,
	postal_code VARCHAR(20) not null,
	country VARCHAR(50) not null,
    account_password varchar(50) not null,
    admin_level TINYINT NOT NULL DEFAULT 0,
    constraint PK_users primary key (userId)
);

create table orders(
	orderId int not null auto_increment,
    userId int not null,
    totalPrice decimal(10,2) not null,
    order_Status varchar(20) not null,	-- pending accepted delivering delivered rejected 
    payment_Code int not null,			-- payment identification (to be inplemented front end)
    created_At TIMESTAMP not null,
    updated_At TIMESTAMP not null,
    constraint PK_Orders primary key (orderId),
    foreign key (userId) references users(userId)
);

create table order_items(
	itemId int not null auto_increment,
    orderId int not null,			-- FK to orders
    componentId int not null,		-- FK to pizza_components
	componentAmount decimal(2,1),
    componentPrice decimal(5,2),
    constraint PK_order_items primary key (itemId),
    foreign key (orderId) references orders(orderId),
    foreign key (componentId) references pizza_components(pizzaId)
)

