import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface NavLink {
  label: string;
  route: string;
  hasDropdown: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  @Input() brandName: string = 'Vet Clinic';
  @Input() logoIcon: string  = 'bi-heart-pulse-fill';

  readonly navLinks: NavLink[] = [
    { label: 'Nosotros',  route: '/nosotros',  hasDropdown: true  },
    { label: 'Servicios', route: '/servicios', hasDropdown: true  },
    { label: 'Clínica',   route: '/clinica',   hasDropdown: true  },
    { label: 'Blog',      route: '/blog',      hasDropdown: false }
  ];

  isScrolled  = false;
  isMenuOpen  = false;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled = window.scrollY > 20;
      });
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.isMenuOpen = false;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}