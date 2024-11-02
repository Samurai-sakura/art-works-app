import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailsService } from '../../services/details.service';
import { PictureInterface } from '../../interfaces/data.interface';
import { HttpClientModule } from '@angular/common/http';
import { LoadingSpinerComponent } from '../loading-spiner/loading-spiner.component';
import { CommonModule } from '@angular/common';
import { Config } from '../../interfaces/config.interface';
import { Painter } from '../../interfaces/painter-info.interface';
import { LocalStorageService } from '../../services/local-storage.service';
import { onePictureCardMapper } from '../../utils/one-picture-mapper';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [HttpClientModule, LoadingSpinerComponent, CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  providers: [DetailsService, LocalStorageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent implements OnInit {
  public itemId: number | string | null = null;
  public pageNumber: boolean | null | string = null;
  public picture: PictureInterface = {
    id: 0,
    title: '',
    thumbnail: {
      lqip: '',
      alt_text: '',
    },
    date_display: '',
    place_of_origin: '',
    credit_line: '',
    artist_display: '',
    artist_title: '',
    dimensions: '',
    image_id: '',
    image_url: '',
    main_reference_number: '',
  };
  public loading = false;
  public painter_info: Painter = {
    main_reference_number: '',
    painter_nationality: '',
  };
  public artist_life: string | null | RegExpMatchArray = '';
  public config: Config = {
    iiif_url: '',
    website_url: '',
  };
  constructor(
    private route: ActivatedRoute,
    private detailsService: DetailsService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.paramMap.subscribe((params) => {
      this.itemId = params.get('id');

      this.detailsService.getData(this.itemId).subscribe((res) => {
        this.picture = res.data;
        this.config = res.config;
        this.picture = onePictureCardMapper(this.picture, this.config);
        this.painter_info.main_reference_number =
          this.picture.main_reference_number;
        this.painter_info.painter_nationality = this.picture.place_of_origin;
        this.loading = false;
      });
    });
  }

  public setToFavorites() {
    this.localStorageService.addToLocalStorage(this.picture);
  }
}
