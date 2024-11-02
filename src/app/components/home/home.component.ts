import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ResponseService } from '../../services/response.service';
import { HttpClientModule } from '@angular/common/http';
import { PictureInterface } from '../../interfaces/data.interface';
import { Pagination } from '../../interfaces/pagination.interface';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, SlicePipe } from '@angular/common';
import { PaginationService } from '../../services/pagination.service';
import { Config } from '../../interfaces/config.interface';
import { pictureCardMapper } from '../../utils/picture-mapper';
import { LocalStorageService } from '../../services/local-storage.service';
import { LoadingSpinerComponent } from '../loading-spiner/loading-spiner.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HttpClientModule,
    NgbPaginationModule,
    SlicePipe,
    LoadingSpinerComponent,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [ResponseService, PaginationService, LocalStorageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  public pictures: PictureInterface[] = [];
  public paginationParameters: Pagination = {
    total: 0,
    limit: 0,
    next_url: '',
    prev_url: '',
    current_page: 0,
  };
  public isPagination = false;
  public isPicture = true;
  public config: Config = {
    iiif_url: '',
    website_url: '',
  };
  public loading = false;
  public pageNumber = 1;
  public paginationPictures: PictureInterface[] = [];
  constructor(
    private responseService: ResponseService,
    private paginationService: PaginationService,
    private localStorageService: LocalStorageService
  ) {
    //   this.loading = true;
    //   this.responseService.getData().subscribe(res =>{
    //   this.paginationParameters = res.pagination;
    //   this.config = res.config;
    //   this.pictures = pictureCardMapper(res.data, this.config);
    //   this.loading = false;
    // });
    // this.loading = true;
    // this.paginationService.getData(this.pageNumber).subscribe(res =>{
    //   this.paginationPictures = res.data;
    //   this.paginationPictures = this.paginationPictures.slice(0, 3);
    //   this.paginationPictures = pictureCardMapper(this.paginationPictures, this.config);
    //   this.loading = false;
    // });
  }

  ngOnInit(): void {
    this.loading = true;
    this.responseService.getData().subscribe((res) => {
      this.paginationParameters = res.pagination;
      this.config = res.config;
      this.pictures = pictureCardMapper(res.data, this.config);
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
