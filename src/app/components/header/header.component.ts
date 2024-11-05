import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  public currentPath?: string;

  constructor(private router: ActivatedRoute) {}

  ngOnInit(): void {
    this.currentPath = this.router.snapshot.url.join();
    console.log(this.currentPath);
  }
}
