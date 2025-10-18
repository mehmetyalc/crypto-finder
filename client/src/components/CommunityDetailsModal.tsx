import { useState } from 'react';
import { SocialMetrics } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, Heart, TrendingUp, Activity } from 'lucide-react';
import {
  calculateCommunityMetrics,
  getCommunityStrengthLabel,
  getCommunityStrengthColor,
} from '@/lib/communityCalculator';

interface CommunityDetailsModalProps {
  name: string;
  symbol: string;
  socialMetrics?: SocialMetrics;
  isOpen: boolean;
  onClose: () => void;
}

export function CommunityDetailsModal({
  name,
  symbol,
  socialMetrics,
  isOpen,
  onClose,
}: CommunityDetailsModalProps) {
  const metrics = calculateCommunityMetrics(socialMetrics);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {name} ({symbol.toUpperCase()}) - Topluluk Analizi
          </DialogTitle>
        </DialogHeader>

        {!socialMetrics || Object.values(socialMetrics).every((v) => !v) ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Topluluk verisi bulunamadı</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Genel Skor */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Genel Topluluk Gücü</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {metrics.overallCommunityScore}
                  </p>
                </div>
                <Badge
                  className={`text-lg px-4 py-2 ${getCommunityStrengthColor(
                    metrics.overallCommunityScore
                  )}`}
                >
                  {getCommunityStrengthLabel(metrics.overallCommunityScore)}
                </Badge>
              </div>
            </div>

            {/* Sosyal Medya Metrikleri */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Reddit */}
              {socialMetrics.reddit_subscribers !== undefined &&
                socialMetrics.reddit_subscribers > 0 && (
                  <div className="border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-gray-900">Reddit</h3>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-600">Takipçiler</p>
                        <p className="text-lg font-bold text-gray-900">
                          {(socialMetrics.reddit_subscribers / 1000).toFixed(0)}K
                        </p>
                      </div>
                      {socialMetrics.reddit_average_posts_48h !== undefined && (
                        <div>
                          <p className="text-xs text-gray-600">Ortalama Post (48h)</p>
                          <p className="text-lg font-bold text-gray-900">
                            {socialMetrics.reddit_average_posts_48h.toFixed(1)}
                          </p>
                        </div>
                      )}
                      {socialMetrics.reddit_average_comments_48h !== undefined && (
                        <div>
                          <p className="text-xs text-gray-600">Ortalama Yorum (48h)</p>
                          <p className="text-lg font-bold text-gray-900">
                            {socialMetrics.reddit_average_comments_48h.toFixed(1)}
                          </p>
                        </div>
                      )}
                      {socialMetrics.reddit_accounts_active_48h !== undefined && (
                        <div>
                          <p className="text-xs text-gray-600">Aktif Hesaplar (48h)</p>
                          <p className="text-lg font-bold text-gray-900">
                            {socialMetrics.reddit_accounts_active_48h}
                          </p>
                        </div>
                      )}
                      <div className="pt-2 border-t border-orange-100">
                        <Badge className="bg-orange-100 text-orange-800">
                          Skor: {metrics.redditScore}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

              {/* Telegram */}
              {socialMetrics.telegram_channel_user_count !== undefined &&
                socialMetrics.telegram_channel_user_count > 0 && (
                  <div className="border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Telegram</h3>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-600">Kanal Üyeleri</p>
                        <p className="text-lg font-bold text-gray-900">
                          {(socialMetrics.telegram_channel_user_count / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <div className="pt-2 border-t border-blue-100">
                        <Badge className="bg-blue-100 text-blue-800">
                          Skor: {metrics.telegramScore}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

              {/* Facebook */}
              {socialMetrics.facebook_likes !== undefined &&
                socialMetrics.facebook_likes > 0 && (
                  <div className="border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="w-5 h-5 text-red-600" />
                      <h3 className="font-semibold text-gray-900">Facebook</h3>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-600">Beğeniler</p>
                        <p className="text-lg font-bold text-gray-900">
                          {(socialMetrics.facebook_likes / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <div className="pt-2 border-t border-red-100">
                        <Badge className="bg-red-100 text-red-800">
                          Skor: {metrics.facebookScore}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
            </div>

            {/* Skor Açıklaması */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Skor Nasıl Hesaplanır?</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>Reddit (50%):</strong> Takipçiler, post/yorum aktivitesi, aktif hesaplar</li>
                    <li>• <strong>Telegram (35%):</strong> Kanal üye sayısı</li>
                    <li>• <strong>Facebook (15%):</strong> Beğeni sayısı</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Yorum */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Activity className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-900">
                    <strong>Not:</strong> Topluluk gücü yüksek olsa bile, projenin teknik kalitesi, 
                    güvenliği ve uzun vadeli potansiyeli ayrı olarak değerlendirilmelidir.
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={onClose} className="w-full">
              Kapat
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

