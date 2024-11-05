import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { PictureInterface } from "@interfaces/data.interface";
import { Pagination } from "@interfaces/pagination.interface";
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule, SlicePipe } from "@angular/common";
import { Config } from "@interfaces/config.interface";
import { pictureCardMapper } from "@utils/picture-mapper";
import { LoadingSpinerComponent } from "@components/loading-spiner/loading-spiner.component";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { LocalStorageService } from "@services/local-storage.service";
import { PaginationService } from "@services/pagination.service";
import { ResponseService } from "@services/response.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    HttpClientModule,
    NgbPaginationModule,
    SlicePipe,
    LoadingSpinerComponent,
    CommonModule,
    RouterLink,
    FormsModule,
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
  providers: [ResponseService, PaginationService, LocalStorageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  public pictures: PictureInterface[] = [];
  public paginationParameters: Pagination = {
    total: 0,
    limit: 0,
    next_url: "",
    prev_url: "",
    current_page: 0,
  };
  public searchPictures: PictureInterface[] = [];
  public isPagination = false;
  public isPicture = true;
  public config: Config = {
    iiif_url: "",
    website_url: "",
  };
  public searchString = "";
  public loading = false;
  public pageNumber = 1;
  public paginationPictures: PictureInterface[] = [];
  constructor(
    private responseService: ResponseService,
    private paginationService: PaginationService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.responseService.getData().subscribe((res) => {
      this.paginationParameters = res.pagination;
      this.config = res.config;
      this.pictures = pictureCardMapper(res.data, this.config);
      this.searchPictures = this.pictures;
      this.loading = false;
    });
    this.loading = true;
    this.paginationService.getData(this.pageNumber).subscribe((res) => {
      this.paginationPictures = res.data;
      this.paginationPictures = this.paginationPictures.slice(0, 3);
      this.paginationPictures = pictureCardMapper(
        this.paginationPictures,
        this.config
      );
      this.loading = false;
    });
  }

  public searchArts() {
    if (!this.searchString) {
      return;
    }
    this.searchPictures = this.pictures.filter((picture) =>
      picture.title.toLowerCase().includes(this.searchString.toLowerCase())
    );
    this.searchPictures = this.searchPictures.concat(
      this.paginationPictures.filter((picture) =>
        picture.title.toLowerCase().includes(this.searchString.toLowerCase())
      )
    );
    this.searchPictures = this.searchPictures.concat(
      this.pictures.filter((picture) =>
        picture.artist_title
          .toLowerCase()
          .includes(this.searchString.toLowerCase())
      )
    );
    this.searchPictures = this.searchPictures.concat(
      this.paginationPictures.filter((picture) =>
        picture.artist_title
          .toLowerCase()
          .includes(this.searchString.toLowerCase())
      )
    );
    this.searchPictures = this.searchPictures.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    );
  }

  public selectChanged(value: Event) {
    const target = value.target as HTMLSelectElement;
    if (target.value === "title") {
      this.searchPictures.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      });
    } else if (target.value === "author") {
      this.searchPictures.sort((a, b) => {
        if (a.artist_title < b.artist_title) {
          return -1;
        }
        if (a.artist_title > b.artist_title) {
          return 1;
        }
        return 0;
      });
    } else {
      this.searchPictures.sort((a, b) => {
        if (a.place_of_origin < b.place_of_origin) {
          return -1;
        }
        if (a.place_of_origin > b.place_of_origin) {
          return 1;
        }
        return 0;
      });
    }
  }

  public onPageChanged(pageNumber: number) {
    this.paginationService.getData(pageNumber).subscribe((res) => {
      this.paginationPictures = res.data.splice(0, 3);
      this.pageNumber = res.pagination.current_page;
      this.paginationPictures = pictureCardMapper(
        this.paginationPictures,
        this.config
      );
    });
  }

  public setToFavorites(picture: PictureInterface) {
    this.localStorageService.addToLocalStorage(picture);
  }
}
