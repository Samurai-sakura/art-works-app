import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "home",
    loadComponent: () =>
      import("./components/home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "favorites",
    loadComponent: () =>
      import("./components/favorites/favorites.component").then(
        (m) => m.FavoritesComponent
      ),
  },
  {
    path: "home/details/:id",
    loadComponent: () =>
      import("./components/details/details.component").then(
        (m) => m.DetailsComponent
      ),
  },
];
