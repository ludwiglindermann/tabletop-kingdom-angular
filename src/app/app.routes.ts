import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio';
import { LoginComponent } from './components/login/login';
import { RegistroComponent } from './components/registro/registro';
import { RecuperarComponent } from './components/recuperar/recuperar';
import { PerfilComponent } from './components/perfil/perfil';
import { CategoriasComponent } from './components/categorias/categorias';
import { AdminComponent } from './components/admin/admin';
import { CarritoComponent } from './components/carrito/carrito';
import { OfertasComponent } from './components/ofertas/ofertas';

/** Definición de las rutas de la aplicación, asociando cada dirección con su componente correspondiente. */
export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'recuperar', component: RecuperarComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'categorias/:id', component: CategoriasComponent },
  { path: 'ofertas', component: OfertasComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: '**', redirectTo: '' }
];