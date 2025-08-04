# Twitter OAuth Referral System Setup

Bu sistem, Twitter/X OAuth kullanarak kullanıcıların davet linkleri ile arkadaşlarını davet etmesini ve her iki tarafa da puan dağıtmasını sağlar.

## Kurulum Adımları

### 1. Supabase Kurulumu

1. Supabase projenizi oluşturun
2. `supabase-schema.sql` dosyasındaki SQL'i Supabase SQL Editor'da çalıştırın
3. Supabase URL ve API key'lerini alın

### 2. Twitter OAuth Uygulaması

1. [Twitter Developer Portal](https://developer.twitter.com/)'a gidin
2. Yeni bir uygulama oluşturun
3. OAuth 2.0 ayarlarını yapın:
   - Callback URL: `http://localhost:3000/api/auth/callback/twitter` (development)
   - Callback URL: `https://yourdomain.com/api/auth/callback/twitter` (production)
4. Client ID ve Client Secret'ı alın

### 3. Environment Variables

`.env.local` dosyası oluşturun:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Twitter OAuth Configuration
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
TWITTER_CALLBACK_URL=http://localhost:3000/api/auth/callback/twitter
```

### 4. Sistem Akışı

#### Davet Linki Oluşturma:
- Her kullanıcının unique bir davet linki var: `/boost/{username}`
- Örnek: `https://yourdomain.com/boost/sandyXBT`

#### OAuth Akışı:
1. Kullanıcı davet linkine tıklar
2. "Connect your X" butonuna basar
3. Twitter OAuth sayfasına yönlendirilir
4. Twitter'da giriş yapar ve izin verir
5. Callback URL'e döner
6. Sistem yeni kullanıcıyı kaydeder ve puanları dağıtır

#### Puan Dağıtımı:
- **Yeni kullanıcı:** 50 points + 0.125 $USDA
- **Davet eden:** 100 points + 0.25 $USDA

### 5. Dosya Yapısı

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── twitter/
│   │       │   └── route.ts          # OAuth başlatma
│   │       └── callback/
│   │           └── twitter/
│   │               └── route.ts       # OAuth callback
│   ├── boost/
│   │   └── [username]/
│   │       └── page.tsx              # Davet sayfası
│   └── dashboard/
│       └── page.tsx                  # Kullanıcı dashboard'u
├── components/
│   └── Header.tsx                    # Scrolling ticker
└── lib/
    └── supabase.ts                   # Supabase client
```

### 6. Güvenlik Özellikleri

- **PKCE (Proof Key for Code Exchange):** OAuth güvenliği için
- **State Parameter:** CSRF koruması için
- **Row Level Security (RLS):** Supabase veri güvenliği
- **HttpOnly Cookies:** OAuth state'lerini güvenli saklama

### 7. Test Etme

1. Development server'ı başlatın: `npm run dev`
2. Test kullanıcısı oluşturun
3. Davet linkini test edin: `http://localhost:3000/boost/testuser`
4. OAuth akışını test edin

### 8. Production Deployment

1. Environment variables'ları production değerleriyle güncelleyin
2. Twitter callback URL'ini production domain'i ile güncelleyin
3. Supabase RLS policies'lerini kontrol edin
4. SSL sertifikası olduğundan emin olun

## Özellikler

- ✅ Twitter/X OAuth entegrasyonu
- ✅ Unique davet linkleri
- ✅ Otomatik puan dağıtımı
- ✅ Güvenli PKCE implementasyonu
- ✅ Supabase veri yönetimi
- ✅ Responsive tasarım
- ✅ Scrolling ticker bar
- ✅ Dashboard ile puan takibi

## Notlar

- Twitter API rate limit'lerini kontrol edin
- Supabase connection pool'unu optimize edin
- Error handling'i production'da test edin
- Logging sistemi ekleyin 