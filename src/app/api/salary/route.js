import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { verifyFirebaseIdToken } from '@/utils/getFirebaseId';


const prisma = new PrismaClient()

export async function GET(request) {
    try {
        const currentUser = await verifyFirebaseIdToken(request);

        const users = await prisma.user.findMany({
            where: {
                id: currentUser,
            },
        });
        const result = JSON.stringify(users);
        return NextResponse.json({ result }, { status: 200 });
        // return NextResponse.json({ result });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


export async function PUT(request) {
    const currentUser = await verifyFirebaseIdToken(request);
    const data = await request.json();

    try {
        const updateUsers = await prisma.User.update({
            where: {
                id: currentUser,
            },
            data: {
                essentials: data.essentials,
                non_essentials: data.non_essentials,
                savings: data.savings,
            }
        })
        console.log(updateUsers);
        return NextResponse.json({ message: "Data updated successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


export async function POST(request) {
    const currentUser = await verifyFirebaseIdToken(request);
    const data = await request.json();

    try {
        const newEntry = await prisma.User.create({
            data: {
                id: currentUser,
                email: data.email,
                name: data.name,
                salary: data.salary
            }
        })
        console.log(newEntry);
        return NextResponse.json({ "message": "User created successfully" }, { status: 200 });
    } catch (error) {
        console.error('Request error', error)
        return NextResponse.json({ "error": "An error occurred" }, { status: 500 });
    }
}