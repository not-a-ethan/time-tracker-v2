"use client";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@heroui/navbar";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { ThemeSwitch } from "./themeSwitcher";

import styles from "../styles/nav.module.css";

export function Nav() {
    return (
        <Navbar>
            <NavbarBrand>
                <Link href="/" className={`${styles.name}`}>Time Tracker V2</Link>
            </NavbarBrand>

            <NavbarContent justify="center">
                <NavbarItem>
                    <Link href="/dashboard">Dashboard</Link>
                </NavbarItem>

                <NavbarItem>
                    <Link href="/projects">Projects</Link>
                </NavbarItem>

                <NavbarItem>
                    <Link href="/timeEntries">Time Entries</Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
                    <Button as={Link} href="/api/auth/signin">Signin/Signup</Button>
                </NavbarItem>

                <NavbarItem>
                    <ThemeSwitch />
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
};