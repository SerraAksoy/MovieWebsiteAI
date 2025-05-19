import React from "react";
import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-base-100 text-base-content py-12 px-6 md:px-20">
            <div className="max-w-5xl mx-auto text-center">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
                    <div className="flex flex-col items-center text-center bg-base-200 p-4 rounded-xl shadow-md">
                        <div className="avatar mb-2">
                            <div className="w-30 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <Image src="/avatars/damla.png" alt="Damla" width={96} height={96} />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold">Damla Göktaş</h3>
                        <p className="text-sm text-gray-500">AI & Görüntü İşleme</p>
                    </div>

                    <div className="flex flex-col items-center text-center bg-base-200 p-4 rounded-xl shadow-md">
                        <div className="avatar mb-2">
                            <div className="w-30 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <Image src="/avatars/serra.png" alt="Serra" width={96} height={96} />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold">Serra Aksoy</h3>
                        <p className="text-sm text-gray-500">Fullstack & UI Design</p>
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary">
                    Cinephoria - Bitirme Projesi Tanıtımı
                </h1>
                <p className="text-lg md:text-xl text-gray-500 mb-12">
                    Bu proje, kullanıcıların film keşfetmesini ve görsel benzerliğe dayalı öneriler almasını sağlayan yenilikçi bir film platformudur.
                </p>

                <div className="grid md:grid-cols-2 gap-12 text-left">
                    <div className="card bg-base-200 shadow-lg">
                        <div className="card-body">
                            <h2 className="text-2xl font-bold font-bender mb-2">Frontend Teknolojileri</h2>
                            <ul className="list-disc list-inside space-y-2">
                                <li><strong>Next.js:</strong> Sunucu tarafı render (SSR) ve SEO dostu dinamik sayfalar oluşturmak için kullanıldı. Projenin yüksek performanslı ve SEO uyumlu olmasını sağladı.</li>
                                <li><strong>React:</strong> Bileşen tabanlı mimarisi sayesinde kullanıcı arayüzünün modüler ve yeniden kullanılabilir parçalar halinde geliştirilmesini mümkün kıldı.</li>
                                <li><strong>Tailwind CSS + DaisyUI:</strong> Hızlı ve şık kullanıcı arayüzleri oluşturmak için utility-first CSS frameworkleri kullanıldı, böylece tasarım tutarlılığı ve özelleştirme kolaylaştı.</li>
                                <li><strong>AOS:</strong> Sayfa kaydırma sırasında animasyonlar ekleyerek kullanıcı deneyimini daha etkileşimli ve görsel olarak çekici hale getirdi.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="card bg-base-200 shadow-lg">
                        <div className="card-body">
                            <h2 className="text-2xl font-bold font-bender mb-2">Backend Teknolojileri</h2>
                            <ul className="list-disc list-inside space-y-2">
                                <li><strong>Node.js & Express:</strong> REST API servisleri oluşturmak için kullanıldı, böylece hızlı ve ölçeklenebilir sunucu tarafı uygulamalar geliştirildi.</li>
                                <li><strong>MongoDB:</strong> NoSQL veri tabanı olarak kullanıldı, esnek veri yapısı sayesinde film ve kullanıcı verileri etkin bir şekilde yönetildi.</li>
                                <li><strong>JWT:</strong> Güvenli kullanıcı kimlik doğrulama ve yetkilendirme işlemleri için JSON Web Token teknolojisi entegre edildi.</li>
                                <li><strong>Multer:</strong> Kullanıcıların görsel yüklemelerini işlemek ve sunucuda güvenli şekilde saklamak için dosya yükleme aracı olarak kullanıldı.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="card bg-base-200 shadow-lg">
                        <div className="card-body">
                            <h2 className="text-2xl font-bold font-bender mb-2">Yapay Zeka ve Görüntü İşleme</h2>
                            <ul className="list-disc list-inside space-y-2">
                                <li><strong>CLIP (OpenAI):</strong> Görsel ve metin arasındaki benzerlikleri analiz etmek için kullanıldı, böylece film posterlerine dayalı öneri sistemi geliştirildi.</li>
                                <li><strong>Sklearn NearestNeighbors:</strong> Kullanıcıya en yakın ve benzer filmleri önerme amacıyla en yakın komşu algoritması uygulandı.</li>
                                <li><strong>PIL & Torch:</strong> Film posterlerinden embed çıkarımı yapmak için Python Imaging Library ve Torch framework’ü kullanıldı, böylece görsel veriler işlenip modelde kullanıldı.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="card bg-base-200 shadow-lg">
                        <div className="card-body">
                            <h2 className="text-2xl font-bold font-bender mb-2">Ek Özellikler</h2>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Kullanıcıların film yorumları yapmasını ve puanlama sistemi ile içeriklere geri bildirim vermesini sağlayan özellikler geliştirildi.</li>
                                <li>İzleme listesi yönetimi ile kullanıcıların favori filmlerini kaydetmesi ve organize etmesi mümkün hale getirildi.</li>
                                <li>Karanlık ve açık tema seçenekleri sunularak kullanıcıların tercih ettikleri görsel deneyimi seçmeleri sağlandı.</li>
                                <li>Yönlendirmeli modallar ve kaydırılabilir (scrollable) slider bileşenleri ile kullanıcı etkileşimi artırıldı ve navigasyon kolaylaştırıldı.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-4 text-primary">Neden Bu Teknolojileri Seçtik?</h2>
                    <p className="text-base md:text-lg text-gray-600">
                        Performans, kullanıcı deneyimi ve geliştirici verimliliği açısından bu teknolojiler güncel endüstri standartlarını karşılıyor.
                        Görsel benzerlik odaklı öneri sistemimiz ise proje içerisinde farklılaşmamızı ve yenilikçi bir yaklaşımı mümkün kıldı.
                    </p>
                </div>
            </div>
        </div>
    );
}