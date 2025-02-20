drop database online_restaurant;
create database online_restaurant;
use online_restaurant;
create table products(
	prodId int not null auto_increment,
    prodName varchar(50) not null,
	prodDesc varchar(200) not null,
    prodPrice decimal(10,2) not null,
    inventory int not null, 			-- amount left
    CONSTRAINT PK_Products PRIMARY KEY (prodId)
);

CREATE TABLE addresses (
	addressId INT AUTO_INCREMENT,
	street VARCHAR(255) NOT NULL,
	city VARCHAR(100) NOT NULL,
	state VARCHAR(50),
	postal_code VARCHAR(20),
	country VARCHAR(50),
	constraint PK_address primary key (addressId)
);

create table accountInfo(
	accountId varchar(50) not null primary key,
    account_password varchar(50) not null,
    IfAdmin boolean not null
);

create table users(
	userId int not null auto_increment,
    accountId varchar(50) not null,
    userFName varchar(20) not null,
    userMName varchar(20) null,
    userLName varchar(20) not null,
    userEmail varchar(50) not null, 	-- need validation on both ends
    addressId int not null, 			-- FK from address table (normalization)
    constraint PK_clients primary key (userId),
	FOREIGN KEY (addressId) REFERENCES addresses(addressId),
    FOREIGN KEY (accountId) REFERENCES accountInfo(accountId)
);

create table orders(
	orderId int not null auto_increment,
    prodId int not null,
    userId int not null,
    totalPrice decimal(10,2) not null,
    order_Status varchar(20) not null,	-- pending accepted delivering delivered rejected 
    created_At TIMESTAMP not null,
    updated_At TIMESTAMP not null,
    constraint PK_Orders primary key (orderId),
    foreign key (prodId) references products(prodId),
    foreign key (userId) references users(userId)
);

