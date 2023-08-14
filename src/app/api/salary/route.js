import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import { verifyFirebaseIdToken } from '@/utils/getFirebaseId';


const prisma = new PrismaClient()


export async function GET(request) {
    const prisma = new PrismaClient()
    const currentUser = await verifyFirebaseIdToken(request);

    const users = await prisma.User.findMany({
        where: {
            id: currentUser,
        },
    })
    const result = JSON.stringify(users);
    return NextResponse.json({ result });
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
    } catch (error) {
        console.error('Request error', error)
    }
    return NextResponse.json({ "hello": "salary PUT api" })
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
    } catch (error) {
        console.error('Request error', error)
    }
    return NextResponse.json({ "hello": "salary POST api" })
}