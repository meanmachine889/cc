import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient(); // For production, consider the singleton pattern.

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
        }

        // 1. Check for existing email in DB
        const existing = await prisma.waitlist.findUnique({
            where: { email },
        });

        if (existing) {
            // ✅ CORRECTED: Return a 409 Conflict status
            return NextResponse.json(
                { message: "You're already on the list!" },
                { status: 409 }
            );
        }

        // Create new entry if not existing
        await prisma.waitlist.create({
            data: { email },
        });

        // 2. Send thank-you email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Clarity Team" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Thanks for subscribing to our waitlist!",
            html: `
        <div style="font-family:sans-serif;padding:20px">
          <h2>🎉 Thanks for joining the waitlist!</h2>
          <p>Hey there,</p>
          <p>We're thrilled to have you on board. You'll be the first to know when we launch!</p>
          <p>– Team Clarity 🚀</p>
        </div>
      `,
        });

        return NextResponse.json({ message: "Subscribed successfully!" }, { status: 201 }); // Using 201 Created is also good practice
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}