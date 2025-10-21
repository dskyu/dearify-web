"use client";
import { Section as SectionType } from "@/types/blocks/section";
import Icon from "@/components/icon";
import {
  Heart,
  Music,
  Video,
  Camera,
  Users,
  Sparkles,
  Play,
  Pause,
} from "lucide-react";
import CircularGallery from "@/components/CircularGallery";

export default function Feature1({ section }: { section: SectionType }) {
  if (section.disabled) {
    return null;
  }

  return (
    <section id={section.name} className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* AI Art Creation Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full text-sm font-medium text-pink-700 mb-6">
              <Camera className="w-4 h-4" />
              <span>AI Art Creation</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Transform Photos into Stunning Artworks
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our advanced AI technology transforms your ordinary photos into
              professional-quality artworks. Each creation tells a unique story
              of love, family, and precious moments.
            </p>
          </div>

          {/* Image Gallery with Stories - Alternating Layout */}
          <div className="space-y-16">
            {/* Story 1: Wedding - Text Left, Image Right */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-pink-200 px-4 py-2 rounded-full text-sm font-medium text-pink-700 mb-6">
                  <Heart className="w-4 h-4" />
                  <span>Wedding Photography</span>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  Sarah & Michael's Wedding
                </h4>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  "We wanted our wedding photos to capture the magic of our
                  special day. The AI created stunning portraits that look like
                  they were taken by a professional photographer, preserving our
                  joy forever."
                </p>
                <div className="flex items-center space-x-4 text-sm text-pink-600">
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Romantic & Elegant
                  </span>
                  <span className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Professional Quality
                  </span>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="aspect-[4/5] bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-pink-400 mx-auto mb-4" />
                    <p className="text-lg text-pink-600 font-medium">
                      Wedding Photo
                    </p>
                    <p className="text-sm text-pink-500">
                      Professional Quality
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Story 2: Family - Image Left, Text Right */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-1">
                <div className="aspect-[4/5] bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <p className="text-lg text-purple-600 font-medium">
                      Family Portrait
                    </p>
                    <p className="text-sm text-purple-500">Warm & Loving</p>
                  </div>
                </div>
              </div>
              <div className="order-2">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-purple-200 px-4 py-2 rounded-full text-sm font-medium text-purple-700 mb-6">
                  <Users className="w-4 h-4" />
                  <span>Family Photography</span>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  The Johnson Family
                </h4>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  "With three kids, getting a perfect family photo was
                  impossible. The AI transformed our chaotic moment into a
                  beautiful portrait that captures our family's love and
                  laughter."
                </p>
                <div className="flex items-center space-x-4 text-sm text-purple-600">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Family & Kids
                  </span>
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Warm & Loving
                  </span>
                </div>
              </div>
            </div>

            {/* Story 3: Travel - Text Left, Image Right */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-blue-200 px-4 py-2 rounded-full text-sm font-medium text-blue-700 mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span>Travel Photography</span>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  Emma & David's Honeymoon
                </h4>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  "Our honeymoon in Santorini was magical, but our selfies
                  didn't do it justice. The AI created breathtaking photos that
                  capture the romance and beauty of our first adventure
                  together."
                </p>
                <div className="flex items-center space-x-4 text-sm text-blue-600">
                  <span className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Travel & Adventure
                  </span>
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Romantic
                  </span>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="aspect-[4/5] bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <p className="text-lg text-blue-600 font-medium">
                      Travel Memory
                    </p>
                    <p className="text-sm text-blue-500">Adventure & Joy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Story 4: Engagement - Image Left, Text Right */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-1">
                <div className="aspect-[4/5] bg-gradient-to-br from-rose-100 to-rose-200 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-rose-400 mx-auto mb-4" />
                    <p className="text-lg text-rose-600 font-medium">
                      Engagement
                    </p>
                    <p className="text-sm text-rose-500">Romantic Moment</p>
                  </div>
                </div>
              </div>
              <div className="order-2">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-rose-100 to-rose-200 px-4 py-2 rounded-full text-sm font-medium text-rose-700 mb-6">
                  <Heart className="w-4 h-4" />
                  <span>Engagement Photography</span>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  Alex & Lisa's Proposal
                </h4>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  "When Alex proposed at sunset, we only had our phones. The AI
                  transformed that blurry, emotional moment into a stunning
                  engagement photo that looks like it belongs in a magazine."
                </p>
                <div className="flex items-center space-x-4 text-sm text-rose-600">
                  <span className="flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Engagement & Romance
                  </span>
                  <span className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Magazine Quality
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Music Creation Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-full text-sm font-medium text-purple-700 mb-6">
              <Music className="w-4 h-4" />
              <span>Music Creation</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Compose Personalized Love Songs
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Express your deepest feelings through custom music. Our AI creates
              personalized love songs that speak directly to your heart and tell
              your unique love story.
            </p>
          </div>

          {/* Music Stories */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Story 1: Anniversary Song */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-purple-100">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">
                    "Five Years Together"
                  </h4>
                  <p className="text-sm text-gray-600">Anniversary Love Song</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-6 mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <Play className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Playing: "Five Years Together"
                    </p>
                    <p className="text-xs text-gray-600">3:24 duration</p>
                  </div>
                </div>
                <div className="bg-white rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full w-2/3"></div>
                </div>
                <p className="text-xs text-gray-500">2:15 / 3:24</p>
              </div>

              <div className="space-y-4">
                <h5 className="font-semibold text-gray-900">
                  James & Maria's Story
                </h5>
                <p className="text-sm text-gray-600 leading-relaxed">
                  "For our 5th anniversary, I wanted to surprise Maria with
                  something special. The AI created a beautiful love song that
                  captures our journey together - from our first date to
                  building our home. She cried when she heard it, and now it's
                  our song."
                </p>
                <div className="flex items-center space-x-4 text-xs text-purple-600">
                  <span className="flex items-center">
                    <Heart className="w-3 h-3 mr-1" />
                    Romantic
                  </span>
                  <span className="flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Personal
                  </span>
                </div>
              </div>
            </div>

            {/* Story 2: Apology Song */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-100">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">
                    "I'm Sorry, My Love"
                  </h4>
                  <p className="text-sm text-gray-600">Reconciliation Song</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-6 mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                    <Play className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Playing: "I'm Sorry, My Love"
                    </p>
                    <p className="text-xs text-gray-600">2:48 duration</p>
                  </div>
                </div>
                <div className="bg-white rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full w-1/2"></div>
                </div>
                <p className="text-xs text-gray-500">1:24 / 2:48</p>
              </div>

              <div className="space-y-4">
                <h5 className="font-semibold text-gray-900">
                  Tom & Rachel's Story
                </h5>
                <p className="text-sm text-gray-600 leading-relaxed">
                  "After a big fight, words weren't enough to express how sorry
                  I was. The AI helped me create a heartfelt song that said
                  everything I couldn't put into words. It brought us back
                  together and made our relationship stronger than ever."
                </p>
                <div className="flex items-center space-x-4 text-xs text-blue-600">
                  <span className="flex items-center">
                    <Heart className="w-3 h-3 mr-1" />
                    Healing
                  </span>
                  <span className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    Reconciliation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Creation Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-2 rounded-full text-sm font-medium text-blue-700 mb-6">
              <Video className="w-4 h-4" />
              <span>Video Creation</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Create Heartwarming Videos
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Bring your most precious moments to life with stunning videos.
              From romantic proposals to family interactions, we create
              cinematic experiences that capture the essence of your
              relationships.
            </p>
          </div>

          {/* Video Stories */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Story 1: Proposal Video */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-100">
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center relative overflow-hidden mb-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-10 h-10 text-blue-600" />
                  </div>
                  <p className="text-lg font-semibold text-blue-700">
                    "The Perfect Proposal"
                  </p>
                  <p className="text-sm text-blue-600">Romantic Moment</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                  </div>
                  <p className="text-white text-sm">3:45</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-900">
                  Mark & Jessica's Proposal
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  "I wanted to capture the exact moment I proposed to Jessica at
                  our favorite beach. The AI created a cinematic video that
                  shows our love story unfolding - from our first meeting to the
                  magical proposal moment. It's our most treasured memory."
                </p>
                <div className="flex items-center space-x-4 text-xs text-blue-600">
                  <span className="flex items-center">
                    <Heart className="w-3 h-3 mr-1" />
                    Proposal
                  </span>
                  <span className="flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Cinematic
                  </span>
                </div>
              </div>
            </div>

            {/* Story 2: Family Video */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-cyan-100">
              <div className="aspect-video bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center relative overflow-hidden mb-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-10 h-10 text-cyan-600" />
                  </div>
                  <p className="text-lg font-semibold text-cyan-700">
                    "Family Moments"
                  </p>
                  <p className="text-sm text-cyan-600">Heartwarming</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                  </div>
                  <p className="text-white text-sm">2:30</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-900">
                  The Williams Family
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  "Our kids are growing up so fast. The AI created a beautiful
                  video montage of our family moments - from birthday parties to
                  bedtime stories. It captures the joy, laughter, and love that
                  fills our home every day."
                </p>
                <div className="flex items-center space-x-4 text-xs text-cyan-600">
                  <span className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    Family
                  </span>
                  <span className="flex items-center">
                    <Heart className="w-3 h-3 mr-1" />
                    Memories
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Perfect for Every Love Story
            </h3>
            <p className="text-gray-600">
              Whether you're celebrating milestones or creating everyday
              memories
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Couples</h4>
              <p className="text-sm text-gray-600">
                Anniversaries & Date Nights
              </p>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Families</h4>
              <p className="text-sm text-gray-600">Kids & Family Moments</p>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Weddings</h4>
              <p className="text-sm text-gray-600">Engagement & Ceremony</p>
            </div>

            <div className="text-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Camera className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Travel</h4>
              <p className="text-sm text-gray-600">Adventure & Memories</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
