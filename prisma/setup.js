const faker = require("@faker-js/faker").faker;

const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "purple",
  "pink",
  "black",
  "white",
  "brown",
  "gray",
];

const brands = ["nike", "adidas", "puma", "reebok"];

const shoes = (number_shoes) => {
  return Array(number_shoes)
    .fill({})
    .map((_, index) => {
      const name = faker.commerce.productName();
      return {
        name: name,
        size: faker.number.int({ min: 10, max: 100 }),
        colorId: faker.number.int({ min: 1, max: colors.length }),
        brandId: faker.number.int({ min: 1, max: brands.length }),
      };
    });
};

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fillColors() {
  const result = await prisma.color.createMany({
    data: [...colors.map((color) => ({ name: color }))],
  });
  console.log(result);
}

async function fillBrands() {
  const result = await prisma.brand.createMany({
    data: [...brands.map((brand) => ({ name: brand }))],
  });
  console.log(result);
}

async function fillShoes() {
  const result = await prisma.shoe.createMany({
    data: [...shoes(20)],
  });
  console.log(result);
}

async function main() {
  await fillBrands();
  await fillColors();
  await fillShoes();
}
main();
