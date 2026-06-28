import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { RegistroComponent } from './registro';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroComponent, ReactiveFormsModule],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // PRUEBA UNITARIA 1: el formulario debe ser inválido si el correo está mal escrito
  it('debería marcar el formulario como inválido si el correo no tiene formato válido', () => {
    component.registroForm.controls['correo'].setValue('correo-invalido');
    expect(component.registroForm.controls['correo'].valid).toBe(false);
  });

  // PRUEBA UNITARIA 2: el formulario debe ser inválido si las contraseñas no coinciden
  it('debería marcar el formulario como inválido si las contraseñas no coinciden', () => {
    component.registroForm.controls['password'].setValue('Password123');
    component.registroForm.controls['password2'].setValue('Password456');
    expect(component.registroForm.errors?.['passwordsNoCoinciden']).toBe(true);
  });

  // PRUEBA EXTRA: el formulario se limpia correctamente
  it('debería limpiar el formulario al llamar onLimpiar()', () => {
    component.registroForm.controls['nombre'].setValue('Juan Pérez');
    component.onLimpiar();
    expect(component.registroForm.controls['nombre'].value).toBeNull();
  });

  // PRUEBA UNITARIA 3: la contraseña debe marcarse como insegura si no tiene mayúscula ni número
  it('debería marcar la contraseña como insegura si no tiene mayúscula ni número', () => {
    component.registroForm.controls['password'].setValue('password');
    expect(component.registroForm.controls['password'].errors?.['passwordInsegura']).toBe(true);
  });

  // PRUEBA UNITARIA 4: la fecha debe ser inválida si el usuario es menor de 13 años
  it('debería marcar la fecha como inválida si el usuario es menor de 13 años', () => {
    component.registroForm.controls['fecha'].setValue('2020-01-01');
    expect(component.registroForm.controls['fecha'].errors?.['edadMinima']).toBe(true);
  });
});