# Instagram Feed Alanı Tasarımı

## Amaç

Ana sayfada `@fztsilasuarikanturhan` hesabına ait gönderilerin yer alacağı, Meta API bağlantısı beklerken de markaya uygun ve dürüst bir durum sunan bir alan oluşturmak.

## Yerleşim

Alan, hizmetler bölümünün ardından ve danışan yorumlarından önce yer alır. Başlık, kısa açıklama, Instagram profil bağlantısı ve masaüstünde üç, mobilde tek sütuna inen altı adet yükleme kartı içerir.

## Davranış

İlk sürümde gerçek gönderi taklidi yapılmaz. Kartlar erişilebilir yükleme durumu olarak işaretlenir ve açıklama, gönderilerin yakında otomatik olarak görüntüleneceğini belirtir. Profil bağlantısı her zaman `https://www.instagram.com/fztsilasuarikanturhan/` adresini yeni sekmede açar.

## Sonraki API Adımı

Meta uygulaması tamamlandığında ayrı bir Vercel fonksiyonu son altı gönderiyi server-side çeker. Erişim anahtarı yalnızca Vercel environment variable olarak saklanır; hiçbir anahtar istemci koduna eklenmez. Başarılı yanıtta yükleme kartları gerçek gönderi kartlarıyla değiştirilir; başarısız yanıtta profil bağlantısı kullanılabilir kalır.

## Doğrulama

Sunucu çıktısında bölüm, profil adresi ve stil dosyası bulunmalıdır. Stil dosyası doğrudan erişilebilir olmalı; mevcut Vercel giriş testi bozulmamalıdır.
