"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { useBlogDetailAnimations } from '@/hooks/useBlogDetailAnimations';

interface BlogPost {
    _id: string;
    title: string;
    content: string;
    excerpt: string;
    featuredImage?: string;
    category?: string;
    slug: string;
    author?: string;
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
    
    const headerRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLElement>(null);
    const relatedRef = useRef<HTMLElement>(null);
    
    useBlogDetailAnimations({ headerRef, contentRef, relatedRef, dir });

    useEffect(() => {
        let isMounted = true;

        const fetchPost = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/blogs?lang=${language}`, { cache: 'no-store' });
                if (res.ok) {
                    const posts: BlogPost[] = await res.json();
                    // Filter published posts
                    const publishedPosts = posts.filter((p: BlogPost & { published?: boolean }) => p.published !== false);
                    const found = publishedPosts.find(p => p.slug === slug || p._id === slug);
                    
                    if (found && isMounted) {
                        setPost(found);
                        
                        // Get related posts (same category, excluding current)
                        const related = publishedPosts
                            .filter(p => 
                                p._id !== found._id && 
                                p.category === found.category
                            )
                            .slice(0, 3);
                        setRelatedPosts(related);
                    } else if (isMounted) {
                        // Post not found
                        router.push('/blog');
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
    }, [slug, language, router]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>{t('blog.loading')}</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className={styles.notFoundContainer}>
                <h1>{t('blog.notFound')}</h1>
                <Link href="/blog" className={styles.backLink}>
                    {t('blog.backToBlog')}
                </Link>
            </div>
        );
    }

    return (
        <main className={styles.blogPostPage} style={{ direction: dir }}>
            {/* Header Section */}
            <header ref={headerRef} className={styles.header}>
                <div className={styles.headerContent}>
                    <Link href="/blog" className={styles.backButton} data-animate="header">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M12 15l-5-5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{t('blog.backToBlog')}</span>
                    </Link>
                    
                    {post.category && (
                        <span className={styles.categoryBadge} data-animate="header">{post.category}</span>
                    )}
                    
                    <h1 className={styles.title} data-animate="header">{post.title}</h1>
                    
                    <div className={styles.meta} data-animate="header">
                        <span className={styles.author}>{post.author || t('blog.defaultAuthor')}</span>
                        <span className={styles.separator}>•</span>
                        <span className={styles.date}>{formatDate(post.createdAt)}</span>
                    </div>
                </div>
                
                {post.featuredImage && (
                    <div className={styles.featuredImageWrapper} data-animate="header">
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

