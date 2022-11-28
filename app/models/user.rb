class User < ApplicationRecord
  has_secure_password
  has_one_attached :user_avatar
  has_many :posts

  validates :user_avatar, content_type: { in: %w(image/jpeg image/gif image/png), message: "jpeg, gif, pngのみ添付可能です．" },
                          size: { less_than: 5.megabytes, message: "画像の容量は5MB以下として下さい．" }
  with_options on: :create do
    validates :password_confirmation, presence: true
    validates :user_name, presence: true, uniqueness: true
    validates :email, presence: true, uniqueness: true
  end
end
