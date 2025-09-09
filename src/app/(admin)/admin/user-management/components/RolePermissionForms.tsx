/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface RolePermissionFormProps {
  permissions: { [key: string]: any };
  setPermissions: Dispatch<SetStateAction<{ [key: string]: any }>>;
}

export default function RolePermissionForm({
  permissions,
  setPermissions,
}: RolePermissionFormProps) {
  const [menus, setMenus] = useState<any[]>([]);

  // Ambil daftar menu dari API
  useEffect(() => {
    const fetchMenus = async () => {
      const res = await fetch("/api/menu/get-menus", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setMenus(data.data.menus || []);
    };
    fetchMenus();
  }, []);

  const handleCheckboxChange = (
    menu_slug: string,
    field: string,
    value: boolean,
  ) => {
    setPermissions({
      ...permissions,
      [menu_slug]: {
        ...permissions[menu_slug],
        menu_slug,
        [field]: value,
      },
    });
  };

  // Select All per kolom (semua menu)
  const handleSelectAllColumn = (field: string, value: boolean) => {
    const updated = { ...permissions };
    menus.forEach((menu) => {
      updated[menu.slug] = {
        ...updated[menu.slug],
        menu_slug: menu.slug,
        [field]: value,
      };
    });
    setPermissions(updated);
  };

  // Select All per menu (satu row)
  const handleSelectAllRow = (menu_slug: string, value: boolean) => {
    setPermissions({
      ...permissions,
      [menu_slug]: {
        menu_slug,
        can_view: value,
        can_create: value,
        can_update: value,
        can_delete: value,
        can_report: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Set Permissions for Role</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Menu</th>
            {[
              { key: "can_view", label: "View" },
              { key: "can_create", label: "Create" },
              { key: "can_update", label: "Update" },
              { key: "can_delete", label: "Delete" },
              { key: "can_report", label: "Report" },
            ].map((col) => (
              <th key={col.key} className="border px-2 py-1 text-center">
                <div className="flex flex-col items-center">
                  <span>{col.label}</span>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleSelectAllColumn(col.key, e.target.checked)
                    }
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {menus.map((menu) => (
            <tr key={menu.slug}>
              <td className="border px-2 py-1">
                <div className="flex items-center justify-between">
                  <span>{menu.name}</span>
                  {/* Select all row */}
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleSelectAllRow(menu.slug, e.target.checked)
                    }
                  />
                </div>
              </td>
              {[
                "can_view",
                "can_create",
                "can_update",
                "can_delete",
                "can_report",
              ].map((field) => (
                <td key={field} className="border px-2 py-1 text-center">
                  <input
                    type="checkbox"
                    checked={permissions[menu.slug]?.[field] || false}
                    onChange={(e) =>
                      handleCheckboxChange(menu.slug, field, e.target.checked)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
