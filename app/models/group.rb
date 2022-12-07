class Group < ApplicationRecord
  has_one_attached :group_avatar
  has_many :group_users, dependent: :destroy
  has_many :users, through: :group_users
  has_many :notices

  validates :group_avatar, content_type: { in: %w(image/jpeg image/gif image/png), message: "のファイル形式は，JPEG, GIF, PNGのみ添付可能です．" },
                           size: { less_than: 5.megabytes, message: "のデータ容量は5MB以下として下さい．" }
  validates :group_name, presence: true, uniqueness: true, on: :create

  def group_user(user)
    group_users.find_by(user_id: user.id)
  end

  # グループにユーザーが招待されたことを通知するnoticeレコードを生成する．
  # 通知受信者はグループに招待されたユーザーとする．
  def create_group_invitation_notice(user)
    GroupUser.where(group_id: id).each do |group_user|
      user.active_notices.create(receiver_id: group_user.user_id, group_user_id: id, group_id: id, notice_factor: "group_invitation")
    end
  end
end
