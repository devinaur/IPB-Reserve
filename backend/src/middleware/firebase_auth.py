import json
import os
from typing import Dict

from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

import firebase_admin
from firebase_admin import auth, credentials

security = HTTPBearer()


def init_firebase() -> None:
    if firebase_admin._apps:
        return

    credentials_source = os.getenv("FIREBASE_CREDENTIALS")
    if not credentials_source:
        raise RuntimeError("FIREBASE_CREDENTIALS environment variable is required for Firebase auth.")

    if os.path.exists(credentials_source):
        cred = credentials.Certificate(credentials_source)
    else:
        try:
            key_data = json.loads(credentials_source)
            cred = credentials.Certificate(key_data)
        except json.JSONDecodeError as exc:
            raise RuntimeError("FIREBASE_CREDENTIALS must be a valid file path or JSON payload.") from exc

    firebase_admin.initialize_app(cred)


async def get_current_user_token(
    credentials: HTTPAuthorizationCredentials = Security(security),
) -> Dict[str, str]:
    token = credentials.credentials
    try:
        decoded = auth.verify_id_token(token)
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid Firebase ID token.") from exc

    uid = decoded.get("uid")
    email = decoded.get("email")
    if not uid or not email:
        raise HTTPException(status_code=401, detail="Firebase token did not contain uid and email.")

    return {"uid": uid, "email": email}
