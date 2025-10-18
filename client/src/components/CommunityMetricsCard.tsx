import { CommunityMetrics, SocialMetrics } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, Heart } from 'lucide-react';
import {
  calculateCommunityMetrics,
  getCommunityStrengthLabel,
  getCommunityStrengthColor,
} from '@/lib/communityCalculator';

interface CommunityMetricsCardProps {
  name: string;
  symbol: string;
  socialMetrics?: SocialMetrics;
}

export function CommunityMetricsCard({
  name,
  symbol,
  socialMetrics,
}: CommunityMetricsCardProps) {
  const metrics = calculateCommunityMetrics(socialMetrics);

  if (!socialMetrics || Object.values(socialMetrics).every((v) => !v)) {
    return (
      <Card className="p-4">
        <h4 className="font-semibold text-gray-900 mb-2">{name}</h4>
        <p className="text-sm text-gray-500">Topluluk verisi bulunamadı</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-xs text-gray-500">{symbol.toUpperCase()}</p>
        </div>
        <Badge className={getCommunityStrengthColor(metrics.overallCommunityScore)}>
          {metrics.overallCommunityScore}
        </Badge>
      </div>

      <p className="text-xs font-medium text-gray-600 mb-3">
        {getCommunityStrengthLabel(metrics.overallCommunityScore)}
      </p>

      <div className="space-y-2">
        {/* Reddit */}
        {socialMetrics.reddit_subscribers !== undefined &&
          socialMetrics.reddit_subscribers > 0 && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-600" />
                <span className="text-gray-700">Reddit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-semibold">
                  {(socialMetrics.reddit_subscribers / 1000).toFixed(0)}K
                </span>
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-orange-600 h-1.5 rounded-full"
                    style={{
                      width: `${Math.min(
                        (metrics.redditScore / 100) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

        {/* Telegram */}
        {socialMetrics.telegram_channel_user_count !== undefined &&
          socialMetrics.telegram_channel_user_count > 0 && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">Telegram</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-semibold">
                  {(socialMetrics.telegram_channel_user_count / 1000).toFixed(0)}K
                </span>
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{
                      width: `${Math.min(
                        (metrics.telegramScore / 100) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

        {/* Facebook */}
        {socialMetrics.facebook_likes !== undefined &&
          socialMetrics.facebook_likes > 0 && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-600" />
                <span className="text-gray-700">Facebook</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-semibold">
                  {(socialMetrics.facebook_likes / 1000).toFixed(0)}K
                </span>
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-red-600 h-1.5 rounded-full"
                    style={{
                      width: `${Math.min(
                        (metrics.facebookScore / 100) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

        {/* Aktivite Metrikleri */}
        {(socialMetrics.reddit_average_posts_48h ||
          socialMetrics.reddit_average_comments_48h) && (
          <div className="border-t border-gray-200 pt-2 mt-2">
            <p className="text-xs font-medium text-gray-600 mb-1">48h Aktivite</p>
            <div className="text-xs text-gray-600 space-y-0.5">
              {socialMetrics.reddit_average_posts_48h && (
                <div>
                  📝 Ortalama Post: {socialMetrics.reddit_average_posts_48h.toFixed(1)}
                </div>
              )}
              {socialMetrics.reddit_average_comments_48h && (
                <div>
                  💬 Ortalama Yorum:{' '}
                  {socialMetrics.reddit_average_comments_48h.toFixed(1)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

