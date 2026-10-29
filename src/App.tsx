import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import publicApiClient from './api/publicApiClient';

type ApiResponse<T> = {
  limit: number;
  skip: number;
  total: number;
  [collection: string]: unknown;
};

type Product = { id: number; title: string; description: string; category: string; price: number; rating: number; thumbnail: string };
type Post = { id: number; title: string; body: string; tags: string[]; views: number; reactions: { likes: number; dislikes: number } };
type User = { id: number; firstName: string; lastName: string; email: string; image: string; company: { title: string; department: string } };
type Quote = { id: number; quote: string; author: string };

function usePublicData<T>(endpoint: string) {
  const [data, setData] = useState<ApiResponse<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    publicApiClient.get<ApiResponse<T>>(endpoint, { signal: controller.signal })
      .then((response) => setData(response.data))
      .catch((requestError: unknown) => {
        if (axios.isCancel(requestError)) return;
        setError(axios.isAxiosError(requestError)
          ? requestError.message
          : requestError instanceof Error ? requestError.message : 'Could not load sample data.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [endpoint]);

  return { data, loading, error };
}

function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-description">{description}</p>
    </div>
  );
}

function JsonResponse({ data }: { data: unknown }) {
  return (
    <details className="json-panel" open>
      <summary><span>Raw API response</span><span className="json-format">JSON</span></summary>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </details>
  );
}

function DataState({ loading, error }: { loading: boolean; error: string }) {
  if (loading) return <div className="data-state"><span className="spinner" />Loading sample data…</div>;
  if (error) return <div className="data-state error-state"><strong>Could not load the API response.</strong><span>{error}</span><small>Check your internet connection and try refreshing the page.</small></div>;
  return null;
}

function DataTab<T>({
  title,
  description,
  eyebrow,
  endpoint,
  collection,
  renderItem,
}: {
  title: string;
  description: string;
  eyebrow: string;
  endpoint: string;
  collection: string;
  renderItem: (item: T) => ReactNode;
}) {
  const { data, loading, error } = usePublicData<T>(endpoint);
  const records = Array.isArray(data?.[collection]) ? data[collection] as T[] : [];

  return (
    <>
      <PageHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="api-toolbar"><span><span className="live-dot" />Live sample API</span><code>GET {endpoint}</code></div>
      <DataState loading={loading} error={error} />
      {data && !loading && !error && <>
        <div className="result-summary"><strong>{data.total}</strong><span>records available</span><span className="summary-divider" /><span>Showing {records.length} of {data.total}</span></div>
        <section className="record-grid">{records.map((record, index) => <div key={index}>{renderItem(record)}</div>)}</section>
        <JsonResponse data={data} />
      </>}
    </>
  );
}

function HomePage() {
  const { data, loading, error } = usePublicData<Quote>('/quotes?limit=3');
  const quotes = Array.isArray(data?.quotes) ? data.quotes as Quote[] : [];

  return (
    <>
      <PageHeading eyebrow="SAMPLE DATA WORKSPACE" title="Welcome to your workspace" description="Explore live sample data from a public REST API. Each tab calls a different endpoint and shows the JSON response." />
      <section className="welcome-card">
        <div>
          <span className="card-kicker">YOUR REACT + TYPESCRIPT STARTER</span>
          <h2>Explore real API responses, right in the app.</h2>
          <p>Browse products, posts, and users. Every tab loads data from the API and shows both a readable preview and the full JSON response.</p>
        </div>
        <div className="welcome-art" aria-hidden="true"><span>R</span><i /><b /></div>
      </section>
      <div className="section-title-row"><div><p className="eyebrow">FROM THE QUOTES API</p><h2>A little inspiration</h2></div></div>
      <DataState loading={loading} error={error} />
      {data && !loading && !error && <>
        <section className="quote-grid">
          {quotes.map((quote) => <article className="quote-card" key={quote.id}><span className="quote-mark">“</span><p>{quote.quote}</p><span className="quote-author">{quote.author}</span></article>)}
        </section>
        <JsonResponse data={data} />
      </>}
    </>
  );
}

function ProductsPage() {
  return <DataTab<Product>
    eyebrow="PUBLIC API / PRODUCTS"
    title="Products"
    description="Sample catalog records with product details, pricing, ratings, and images."
    endpoint="/products?limit=6"
    collection="products"
    renderItem={(product) => <article className="product-card">
      <img src={product.thumbnail} alt={product.title} loading="lazy" />
      <div className="product-details"><span className="record-tag">{product.category}</span><h2>{product.title}</h2><p>{product.description}</p><div className="product-meta"><strong>${product.price.toFixed(2)}</strong><span>★ {product.rating}</span></div></div>
    </article>}
  />;
}

function PostsPage() {
  return <DataTab<Post>
    eyebrow="PUBLIC API / POSTS"
    title="Posts"
    description="Sample posts with body text, tags, views, and reaction counts."
    endpoint="/posts?limit=6"
    collection="posts"
    renderItem={(post) => <article className="post-card">
      <div className="post-topline"><span className="post-id">POST {String(post.id).padStart(3, '0')}</span><span className="post-views">◉ {post.views.toLocaleString()} views</span></div>
      <h2>{post.title}</h2><p>{post.body}</p>
      <div className="post-footer"><div className="tag-list">{post.tags.slice(0, 3).map((tag) => <span className="record-tag" key={tag}>{tag}</span>)}</div><span className="reactions">♡ {post.reactions.likes}</span></div>
    </article>}
  />;
}

function UsersPage() {
  return <DataTab<User>
    eyebrow="PUBLIC API / USERS"
    title="Users"
    description="Sample user profiles with contact details and company information."
    endpoint="/users?limit=6"
    collection="users"
    renderItem={(user) => <article className="user-card">
      <div className="user-heading"><img src={user.image} alt="" loading="lazy" /><div><h2>{user.firstName} {user.lastName}</h2><span>{user.company.title}</span></div></div>
      <a href={`mailto:${user.email}`}>{user.email}</a>
      <div className="user-company"><span>COMPANY</span><strong>{user.company.department}</strong></div>
    </article>}
  />;
}

const tabs = [
  { label: 'Home', path: '/', icon: '⌂' },
  { label: 'Products', path: '/products', icon: '▦' },
  { label: 'Posts', path: '/posts', icon: '▤' },
  { label: 'Users', path: '/users', icon: '♙' },
];

function WorkspaceLayout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand" aria-label="NK Workspace home"><span className="brand-mark">N</span><span>northstar<span className="brand-light"> workspace</span></span></NavLink>
        <div className="topbar-right"><span className="environment-dot" /><span>Development</span><span className="avatar">N</span></div>
      </header>
      <nav className="tab-bar" aria-label="Main navigation">
        {tabs.map((tab) => <NavLink key={tab.path} to={tab.path} end={tab.path === '/'} className={({ isActive }) => `nav-tab${isActive ? ' active' : ''}`}><span className="tab-icon" aria-hidden="true">{tab.icon}</span>{tab.label}</NavLink>)}
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer"><span>NK React Boilerplate</span><span>Sample data by DummyJSON <i>·</i> v0.1</span></footer>
    </div>
  );
}

export default function App() {
  return <WorkspaceLayout />;
}
