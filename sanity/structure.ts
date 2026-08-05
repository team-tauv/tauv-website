import type { StructureResolver } from "sanity/structure";
import { DEPARTMENTS } from "../lib/taxonomy";

/**
 * Studio sol menüsü. Varsayılan otomatik liste yerine elle kuruluyor ki
 * "Site Ayarları" tekil doküman olarak açılsın (yeni kayıt oluşturulamasın)
 * ve içerik tipleri anlamlı bir sırayla dizilsin.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("İçerik")
    .items([
      S.listItem()
        .title("Site Ayarları")
        .id("siteSettings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),

      S.divider(),

      S.documentTypeListItem("vehicle").title("Araçlar"),
      S.documentTypeListItem("competition").title("Yarışmalar"),
      S.documentTypeListItem("news").title("Haberler"),

      S.divider(),

      S.listItem()
        .title("Takım Üyeleri")
        .child(
          S.list()
            .title("Departmanlar")
            .items([
              S.listItem()
                .title("Tümü")
                .child(S.documentTypeList("member").title("Tüm Üyeler")),
              S.divider(),
              // Liste lib/taxonomy.ts'ten geliyor — burada elle tekrarlanırsa
              // departman eklendiğinde Studio menüsü sessizce eksik kalır.
              ...DEPARTMENTS.map(({ value, title }) =>
                S.listItem()
                  .title(title)
                  .id(value)
                  .child(
                    S.documentTypeList("member")
                      .title(title)
                      .filter('_type == "member" && department == $department')
                      .params({ department: value }),
                  ),
              ),
            ]),
        ),

      S.divider(),

      S.documentTypeListItem("sponsor").title("Sponsorlar"),
      S.documentTypeListItem("sponsorshipPackage").title("Sponsorluk Paketleri"),
    ]);

/** Tekil dokümanlar için "yeni oluştur" ve "sil" eylemlerini kapatır. */
export const singletonTypes = new Set(["siteSettings"]);
