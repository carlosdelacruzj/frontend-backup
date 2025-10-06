import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  miFormulario: FormGroup = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    codigo: ['', [Validators.required, Validators.minLength(4)]],
  });

  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  enviarCodigo(): void {
    Swal.fire('Listo', 'Te enviamos un código al correo (demo).', 'info');
  }

  validacion(): void {
    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      return;
    }

    const correo = this.miFormulario.value.correo;
    const codigo = Number(this.miFormulario.value.codigo);
    this.loading = true;

    this.auth.validacion(correo, codigo).subscribe((ok: boolean) => {
      this.loading = false;

      if (!ok) {
        Swal.fire('Código inválido', 'Verifica el código e intenta de nuevo.', 'error');
        return;
      }

      Swal.fire({
        title: '¡Validado!',
        text: 'Tu correo fue validado correctamente.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      this.router.navigateByUrl('/auth/login');
    });
  }
}
