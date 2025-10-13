'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navigationItems = [
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Docs', href: '/docs' },
  { name: 'Contact', href: '/contact' },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left">
            <Link href="/" onClick={() => setOpen(false)}>
              <span className="gradient-text text-2xl font-bold">
                CORTEXCLOUD
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors py-2 px-4 rounded-lg hover:bg-accent"
            >
              {item.name}
            </Link>
          ))}
          <div className="border-t border-border my-4" />
          <Link href="/login" onClick={() => setOpen(false)}>
            <Button variant="outline" className="w-full">
              Sign In
            </Button>
          </Link>
          <Link href="/signup" onClick={() => setOpen(false)}>
            <Button className="w-full">
              Get Started
            </Button>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

