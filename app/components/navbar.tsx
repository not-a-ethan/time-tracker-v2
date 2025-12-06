"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@heroui/navbar";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";



export function Nav() {
    return (
        <Navbar>
            <NavbarBrand>
                Time Tracker V2
            </NavbarBrand>

            <NavbarContent justify="center">
                <NavbarItem>
                    <Link href="/">Home</Link>
                </NavbarItem>

                <NavbarItem>
                    <Link href="/dashboard">Dashboard</Link>
                </NavbarItem>

                <NavbarItem>
                    <Link href="/projects">Projects</Link>
                </NavbarItem>

                <NavbarItem>
                    <Link href="/timeEntries">Time entries</Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end">
                <Button as={Link} href="/api/auth/signin">Signin/Signup</Button>
            </NavbarContent>
        </Navbar>
    );
};