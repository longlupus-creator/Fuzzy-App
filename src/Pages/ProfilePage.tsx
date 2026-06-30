import { asset } from '../backend/data'
import type { GoToPage, Page } from './types'
import type { SessionUser } from '../backend/auth'

export function ProfilePage({
  go,
  user,
  onLogout,
}: {
  go: GoToPage
  user?: SessionUser | null
  onLogout: () => void
}) {
  const rows: Array<{
    title: string
    subtitle: string
    page: Page
    icon?: string
    fallback?: string
  }> = [
    {
      title: 'Đơn hàng',
      subtitle: 'Đơn đang xử lý, đơn gần đây...',
      page: 'orders',
      icon: 'bag.svg',
    },
    {
      title: 'Yêu thích',
      subtitle: 'Sản phẩm bạn đã lưu',
      page: 'wishlist',
      icon: 'heart.svg',
    },
    {
      title: 'Thanh toán',
      subtitle: 'Thẻ đã lưu, ví điện tử',
      page: 'payment',
      icon: 'wallet.svg',
    },
    {
      title: 'Địa chỉ đã lưu',
      subtitle: 'Nhà riêng, văn phòng',
      page: 'address',
      icon: 'location.svg',
    },
    {
      title: 'Ngôn ngữ',
      subtitle: 'Chọn ngôn ngữ hiển thị',
      page: 'language',
      fallback: 'Aa',
    },
    {
      title: 'Thông báo',
      subtitle: 'Ưu đãi, trạng thái đơn hàng',
      page: 'notifications',
      fallback: '!',
    },
    {
      title: 'Cài đặt',
      subtitle: 'Thiết lập ứng dụng, chế độ tối',
      page: 'settings',
      fallback: '*',
    },
    {
      title: 'Điều khoản',
      subtitle: 'Điều khoản sử dụng nền tảng',
      page: 'terms',
      fallback: 'i',
    },
    {
      title: 'Trợ giúp',
      subtitle: 'Hỗ trợ khách hàng, câu hỏi thường gặp',
      page: 'help',
      fallback: '?',
    },
  ]

  return (
    <main className="screen with-tab profile-screen">
      <header className="profile-title">
        <h1>Hồ sơ</h1>
      </header>
      <section className="profile-summary">
        <img src={user?.avatar || asset('icons/profile.png')} alt="" />
        <strong>{user?.name ?? 'Agasya'}</strong>
        <button onClick={() => go('settings')} aria-label="Chỉnh sửa hồ sơ" />
      </section>
      <div className="profile-menu">
        {rows.map((item) => (
          <button key={item.title} onClick={() => go(item.page)}>
            <span className="profile-menu-icon">
              {item.icon ? <img src={asset(`svg/${item.icon}`)} alt="" /> : item.fallback}
            </span>
            <span className="profile-menu-copy">
              <strong>{item.title}</strong>
              <small>{item.subtitle}</small>
            </span>
          </button>
        ))}
      </div>
      <button className="profile-logout-btn" onClick={onLogout}>
        Đăng xuất
      </button>
    </main>
  )
}
