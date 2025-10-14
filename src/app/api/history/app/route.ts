import { NextRequest, NextResponse } from "next/server";
import { appRecordCreateOrUpdate } from "@/models/history";
import { respErr } from "@/lib/resp";
import { getUserUuid } from "@/services/user";
