import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET() {
  const allShoes = await prisma.shoe.findMany({
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      name: true,
      brand: {
        select: {
          name: true,
        },
      },
      color: {
        select: {
          name: true,
        },
      },
      size: true,
    },
  });
  console.log(allShoes);
  return NextResponse.json(allShoes, { status: 200 });
}

export async function POST(request) {
  try {
    const body = await request.json();

    const checkexist = await prisma.shoe.findMany({
      where: {
        name: body.name,
        brand: {
          name: body.brand,
        },
        color: {
          name: body.color,
        },
        size: parseInt(body.size),
      },
    });

    if (checkexist.length > 0) {
      await prisma.shoe.update({
        where: {
          id : body.id
        },
        data: {
          name: body.name,
          color: {
            create: {
              name: body.color,
            },
          },
          size: parseInt(body.size),
          brand: {
            create: {
              name: body.brand,
            },
          },
        },
      })
    }

    const newShoe = await prisma.shoe.create({
      data: {
        name: body.name,
        color: {
          create: {
            name: body.color,
          },
        },
        size: parseInt(body.size),
        brand: {
          create: {
            name: body.brand,
          },
        },
      },
    });
    const allShoes = await prisma.shoe.findMany({
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        name: true,
        brand: {
          select: {
            name: true,
          },
        },
        color: {
          select: {
            name: true,
          },
        },
        size: true,
      },
    });
    return NextResponse.json(allShoes, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}

export async function DELETE(request) {
  const body = await request.json();
  const deletedShoe = await prisma.shoe.delete({
    where: {
      id: body.id,
    },
  });
  return deletedShoe;
}
