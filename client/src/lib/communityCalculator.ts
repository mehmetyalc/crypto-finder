import { SocialMetrics, CommunityMetrics } from './types';

/**
 * Reddit aktivitesine göre skor hesapla
 * Takipçi sayısı, post/yorum aktivitesi ve aktif hesapları dikkate al
 */
export function calculateRedditScore(metrics?: SocialMetrics): number {
  if (!metrics) return 0;

  const subscribers = metrics.reddit_subscribers || 0;
  const avgPosts = metrics.reddit_average_posts_48h || 0;
  const avgComments = metrics.reddit_average_comments_48h || 0;
  const activeAccounts = metrics.reddit_accounts_active_48h || 0;

  // Takipçi sayısına göre skor (logaritmik ölçek)
  let subscriberScore = 0;
  if (subscribers >= 500000) subscriberScore = 100;
  else if (subscribers >= 100000) subscriberScore = 90;
  else if (subscribers >= 50000) subscriberScore = 80;
  else if (subscribers >= 10000) subscriberScore = 70;
  else if (subscribers >= 1000) subscriberScore = 50;
  else if (subscribers > 0) subscriberScore = 20;

  // Aktivite skorunu hesapla
  const totalActivity = avgPosts + avgComments;
  let activityScore = 0;
  if (totalActivity >= 100) activityScore = 100;
  else if (totalActivity >= 50) activityScore = 80;
  else if (totalActivity >= 20) activityScore = 60;
  else if (totalActivity >= 5) activityScore = 40;
  else if (totalActivity > 0) activityScore = 20;

  // Aktif hesaplar skorunu hesapla
  let accountScore = 0;
  if (activeAccounts >= 1000) accountScore = 100;
  else if (activeAccounts >= 500) accountScore = 80;
  else if (activeAccounts >= 100) accountScore = 60;
  else if (activeAccounts >= 10) accountScore = 40;
  else if (activeAccounts > 0) accountScore = 20;

  // Ağırlıklı ortalama: Takipçiler 50%, Aktivite 30%, Aktif Hesaplar 20%
  return Math.round(subscriberScore * 0.5 + activityScore * 0.3 + accountScore * 0.2);
}

/**
 * Telegram aktivitesine göre skor hesapla
 */
export function calculateTelegramScore(metrics?: SocialMetrics): number {
  if (!metrics) return 0;

  const userCount = metrics.telegram_channel_user_count || 0;

  if (userCount >= 500000) return 100;
  if (userCount >= 100000) return 90;
  if (userCount >= 50000) return 80;
  if (userCount >= 10000) return 70;
  if (userCount >= 1000) return 50;
  if (userCount > 0) return 20;

  return 0;
}

/**
 * Facebook aktivitesine göre skor hesapla
 */
export function calculateFacebookScore(metrics?: SocialMetrics): number {
  if (!metrics) return 0;

  const likes = metrics.facebook_likes || 0;

  if (likes >= 1000000) return 100;
  if (likes >= 500000) return 90;
  if (likes >= 100000) return 80;
  if (likes >= 50000) return 70;
  if (likes >= 10000) return 50;
  if (likes > 0) return 20;

  return 0;
}

/**
 * Genel topluluk metrikleri hesapla
 */
export function calculateCommunityMetrics(
  metrics?: SocialMetrics
): CommunityMetrics {
  const redditScore = calculateRedditScore(metrics);
  const telegramScore = calculateTelegramScore(metrics);
  const facebookScore = calculateFacebookScore(metrics);

  // Genel skor: Reddit 50%, Telegram 35%, Facebook 15%
  // (Reddit en aktif platform olduğu için daha yüksek ağırlık)
  const overallScore = Math.round(
    redditScore * 0.5 + telegramScore * 0.35 + facebookScore * 0.15
  );

  return {
    redditScore,
    telegramScore,
    facebookScore,
    overallCommunityScore: overallScore,
  };
}

/**
 * Topluluk gücü hakkında açıklayıcı metin döndür
 */
export function getCommunityStrengthLabel(score: number): string {
  if (score >= 80) return 'Çok Güçlü Topluluk';
  if (score >= 60) return 'Güçlü Topluluk';
  if (score >= 40) return 'Orta Topluluk';
  if (score >= 20) return 'Zayıf Topluluk';
  return 'Çok Zayıf Topluluk';
}

/**
 * Topluluk gücü rengini döndür
 */
export function getCommunityStrengthColor(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-green-50 text-green-700';
  if (score >= 40) return 'bg-yellow-100 text-yellow-800';
  if (score >= 20) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
}

