/* eslint-disable @typescript-eslint/ban-ts-comment */
import { prisma } from '@/app/lib/prisma';
import { apiError, apiResponse } from '@/app/lib/ApiResponse';
import getTokenandReturnUser from '@/app/lib/GetUser';
import { addMonths } from "date-fns";
export async function POST(request: Request) {
    const data = await request.json();
    const token = request.headers.get('cookie')?.split('token=')[1]
    let user;
    if (token) {
        user = await getTokenandReturnUser(token);
    }
    const user_id = user?.id
    if (!user_id) {
        return apiError('Unauthorized', 401);
    }
    data.user = {
        connect: { id: user_id },
    }
    data.expiresAt = addMonths(new Date(), 3)
    const newData = await prisma.userData.create({ data });
    return apiResponse(newData, 'Data uploaded successfully', 200)
};
export async function GET(request: Request) {
    const token = request.headers.get('cookie')?.split('token=')[1]
    let user;
    if (token) {
        user = await getTokenandReturnUser(token);
    }
    const user_id = user?.id
    if (!user_id) {
        return apiError('Unauthorized', 401);
    }
    const data = await prisma.userData.findMany({
        where: { userId: user?.id },
        select:{
            data: false,
            id: true,
            documentName: true,
            dataType: true,
            createdAt: true,
            expiresAt: true
        }
    });
    // @ts-expect-error
    return apiResponse(data, 'Data fetched successfully', 200)
};
export async function DELETE(request: Request) {
    const token = request.headers.get('cookie')?.split('token=')[1]
    let user;
    if (token) {
        user = await getTokenandReturnUser(token);
    }
    const user_id = user?.id
    if (!user_id) {
        return apiError('Unauthorized', 401);
    }
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    await prisma.userData.delete({ where: { id: Number(id) } });
    return apiResponse({}, 'Data deleted successfully', 200)
};