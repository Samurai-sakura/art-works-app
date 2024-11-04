import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FooterComponent } from './footer.component';
import { of } from 'rxjs';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent], // Используйте imports для standalone компонента
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 }) // Мок параметров маршрута
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Добавьте дополнительные тесты для FooterComponent, если необходимо
});