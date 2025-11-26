"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { useBlogDetailAnimations } from '@/hooks/useBlogDetailAnimations';
import { BlogDetailSkeleton } from '@/components/blog/BlogSkeleton';

interface BlogPost {
    _id: string;
    title: string;
    content: string;
    excerpt: string;
    featuredImage?: string;
    category?: string;
    slug: string;
    author?: string;
    authorAr?: string;
    createdAt: string;
    tags?: string[];
    published?: boolean;
}

export default function BlogPostPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const { language, t, dir } = useLanguage();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
    const [readingProgress, setReadingProgress] = useState(0);
    const [shareCopied, setShareCopied] = useState(false);
    
    const headerRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLElement>(null);
    const relatedRef = useRef<HTMLElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    
    useBlogDetailAnimations({ headerRef, contentRef, relatedRef, dir });

    // Fetch blog post
    useEffect(() => {
        let isMounted = true;

        const fetchPost = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/blogs?lang=${language}`, { cache: 'no-store' });
                if (res.ok) {
                    const posts: BlogPost[] = await res.json();
                    const publishedPosts = posts.filter((p: BlogPost & { published?: boolean }) => p.published !== false);
                    const found = publishedPosts.find(p => p.slug === slug || p._id === slug);
                    
                    if (found && isMounted) {
                        setPost(found);
                        
                        const related = publishedPosts
                            .filter(p => 
                                p._id !== found._id && 
                                p.category === found.category
                            )
                            .slice(0, 3);
                        setRelatedPosts(related);
                    } else if (isMounted) {
                        setPost(null);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch blog post', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPost();

        return () => {
            isMounted = false;
        };
    }, [slug, language]);

    // Reading progress calculation
    useEffect(() => {
        const handleScroll = () => {
            if (!contentRef.current) return;
            
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const scrollableHeight = documentHeight - windowHeight;
            const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
            
            setReadingProgress(Math.min(100, Math.max(0, progress)));
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [post]);

    // Update document title and meta tags
    useEffect(() => {
        if (post) {
            const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
            document.title = `${post.title} | Lunier Marina`;
            
            // Update meta description
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', post.excerpt);

            // Update OG tags
            const updateMetaTag = (property: string, content: string) => {
                let tag = document.querySelector(`meta[property="${property}"]`);
                if (!tag) {
                    tag = document.createElement('meta');
                    tag.setAttribute('property', property);
                    document.head.appendChild(tag);
                }
                tag.setAttribute('content', content);
            };

            updateMetaTag('og:title', post.title);
            updateMetaTag('og:description', post.excerpt);
            updateMetaTag('og:type', 'article');
            updateMetaTag('og:url', currentUrl);
            
            if (post.featuredImage) {
                const imageUrl = post.featuredImage.startsWith('http') 
                    ? post.featuredImage 
                    : post.featuredImage.startsWith('/')
                    ? `${typeof window !== 'undefined' ? window.location.origin : ''}${post.featuredImage}`
                    : `${typeof window !== 'undefined' ? window.location.origin : ''}/api/images/${post.featuredImage}`;
                updateMetaTag('og:image', imageUrl);
            }
        }
    }, [post]);

    // Calculate reading time
    const calculateReadingTime = (content: string): number => {
        const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
        const wordsPerMinute = 200;
        const wordCount = text.trim().split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleShare = async (platform: 'copy' | 'facebook' | 'twitter') => {
        const url = typeof window !== 'undefined' ? window.location.href : '';
        const title = post?.title || '';
        
        if (platform === 'copy') {
            try {
                await navigator.clipboard.writeText(url);
                setShareCopied(true);
                setTimeout(() => setShareCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        } else if (platform === 'facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        } else if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        }
    };

    if (loading) {
        return <BlogDetailSkeleton />;
    }

    if (!post) {
        return (
            <main className={styles.blogPostPage}>
                <div className={styles.notFoundContainer}>
                    <h1>{t('blog.notFound')}</h1>
                    <p>{t('blog.notFoundDescription') || 'The blog post you are looking for does not exist.'}</p>
                    <Link href="/blog" className={styles.backLink}>
                        {t('blog.backToBlog')}
                    </Link>
                </div>
            </main>
        );
    }

    const readingTime = post ? calculateReadingTime(post.content) : 0;
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <main className={styles.blogPostPage} style={{ direction: dir }}>
                {/* Reading Progress Bar */}
                <div ref={progressBarRef} className={styles.progressBar}>
                    <div 
                        className={styles.progressFill} 
                        style={{ width: `${readingProgress}%` }}
                    />
                </div>

                {/* Header Section */}
                <header ref={headerRef} className={styles.header}>
                    <div className={styles.headerContent}>
                        <Link href="/blog" className={styles.backButton} data-animate="header">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M12 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>{t('blog.backToBlog')}</span>
                        </Link>
                        
                        <div className={styles.headerMeta} data-animate="header">
                            {post.category && (
                                <span className={styles.categoryBadge}>{post.category}</span>
                            )}
                            <span className={styles.readingTime}>{readingTime} {t('blog.minRead') || 'min read'}</span>
                        </div>
                        
                        <h1 className={styles.title} data-animate="header">{post.title}</h1>
                        
                        <div className={styles.meta} data-animate="header">
                            <div className={styles.authorInfo}>
                                <div className={styles.authorAvatar}>
                                    <span>{post.author?.charAt(0) || 'L'}</span>
                                </div>
                                <div>
                                    <span className={styles.author}>{post.author || t('blog.defaultAuthor')}</span>
                                    <span className={styles.date}>{formatDate(post.createdAt)}</span>
                                </div>
                            </div>
                            
                            {/* Share Buttons */}
                            <div className={styles.shareButtons}>
                                <button
                                    onClick={() => handleShare('copy')}
                                    className={styles.shareButton}
                                    aria-label="Copy link"
                                    title="Copy link"
                                >
                                    {shareCopied ? (
                                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                                            <path d="M16 6L8 14l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                                            <path d="M8 2v4M12 2v4M4 6h12M4 6v10a2 2 0 002 2h8a2 2 0 002-2V6M4 6l2-4M16 6l-2-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleShare('facebook')}
                                    className={styles.shareButton}
                                    aria-label="Share on Facebook"
                                    title="Share on Facebook"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleShare('twitter')}
                                    className={styles.shareButton}
                                    aria-label="Share on Twitter"
                                    title="Share on Twitter"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {post.featuredImage && (
                        <div className={styles.featuredImageWrapper} data-animate="header">
                            <div className={styles.imageParallax} data-parallax="true">
                                <Image
                                    src={
                                        post.featuredImage.startsWith('http') 
                                            ? post.featuredImage 
                                            : post.featuredImage.startsWith('/')
                                            ? post.featuredImage
                                            : `/api/images/${post.featuredImage}`
                                    }
                                    alt={post.title}
                                    fill
                                    className={styles.featuredImage}
                                    priority
                                    sizes="100vw"
                                />
                            </div>
                        </div>
                    )}
                </header>

                {/* Content Section */}
                <article ref={contentRef} className={styles.content}>
                    <div className={styles.contentWrapper}>
                        <div 
                            className={styles.postContent}
                            data-animate="content"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                        
                        {post.tags && post.tags.length > 0 && (
                            <div className={styles.tags} data-animate="content">
                                <span className={styles.tagsLabel}>{t('blog.tags')}:</span>
                                <div className={styles.tagsList}>
                                    {post.tags.map(tag => (
                                        <span key={tag} className={styles.tag}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </article>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section ref={relatedRef} className={styles.relatedSection}>
                        <div className={styles.relatedContainer}>
                            <h2 className={styles.relatedTitle} data-animate="related">{t('blog.relatedPosts')}</h2>
                            <div className={styles.relatedGrid}>
                                {relatedPosts.map((relatedPost, index) => (
                                    <Link
                                        key={relatedPost._id}
                                        href={`/blog/${relatedPost.slug || relatedPost._id}`}
                                        className={styles.relatedCard}
                                        data-animate="related"
                                    >
                                        {relatedPost.featuredImage && (
                                            <div className={styles.relatedImageWrapper}>
                                                <Image
                                                    src={
                                                        relatedPost.featuredImage.startsWith('http') 
                                                            ? relatedPost.featuredImage 
                                                            : relatedPost.featuredImage.startsWith('/')
                                                            ? relatedPost.featuredImage
                                                            : `/api/images/${relatedPost.featuredImage}`
                                                    }
                                                    alt={relatedPost.title}
                                                    fill
                                                    className={styles.relatedImage}
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                />
                                            </div>
                                        )}
                                        <div className={styles.relatedContent}>
                                            {relatedPost.category && (
                                                <span className={styles.relatedCategory}>{relatedPost.category}</span>
                                            )}
                                            <h3 className={styles.relatedCardTitle}>{relatedPost.title}</h3>
                                            <p className={styles.relatedCardExcerpt}>{relatedPost.excerpt}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
        </main>
    );
}
