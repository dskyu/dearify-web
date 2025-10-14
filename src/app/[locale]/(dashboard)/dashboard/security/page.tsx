"use client";

import { Link } from "@/i18n/navigation";

export default function SecurityPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Security</h1>
        <p className="text-gray-600">Manage your security settings</p>
      </div>
      <div className="max-w-2xl ">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Reset Password</h3>
          <p className="text-sm text-gray-600 mb-6">Reset password to enable email login</p>
          <p className="text-muted-foreground text-sm mb-6">
            Resetting your password will allow you to sign in using your email and password in addition to your social login methods. You will receive an email
            with instructions to reset your password
          </p>
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              target="_blank"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Reset Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
