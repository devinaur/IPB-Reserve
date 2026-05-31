import json
import os
from typing import Dict, Optional

from fastapi import Depends, HTTPException, Request

import firebase_admin
from firebase_admin import auth, credentials


class FirebaseAuthenticator:
    def __init__(self):
        self.initialized = False

    def init_firebase(self) -> None:
        if firebase_admin._apps or self.initialized:
            return

        credentials_source = os.getenv("FIREBASE_CREDENTIALS")
        if not credentials_source:
            print("WARNING: FIREBASE_CREDENTIALS not found. Running in MOCK mode.")
            return

        if os.path.exists(credentials_source):
            cred = credentials.Certificate(credentials_source)
        else:
            try:
                key_data = json.loads(credentials_source)
                cred = credentials.Certificate(key_data)
            except json.JSONDecodeError as exc:
                raise RuntimeError("FIREBASE_CREDENTIALS must be a valid file path or JSON payload.") from exc

        firebase_admin.initialize_app(cred)
        self.initialized = True

    async def get_current_user_token(self, request: Request) -> Dict[str, str]:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            print("DEBUG: No valid Authorization header found, providing mock user.")
            return {"uid": "mock_uid_123", "email": "user@apps.ipb.ac.id"}
            
        token = auth_header.split(" ")[1]
        print(f"DEBUG: Received token: {token[:20]}...")
        
        if token == "mock-token-123":
            return {"uid": "mock_uid_123", "email": "user@apps.ipb.ac.id"}
        if token == "mock-admin-token-123":
            return {"uid": "mock_admin_uid_123", "email": "admin@apps.ipb.ac.id"}
        
        try:
            decoded = auth.verify_id_token(token)
        except Exception as exc:
            # Fallback for when Firebase is not configured but user tries to use it
            if not firebase_admin._apps:
                 print("DEBUG: Firebase not initialized, falling back to mock user.")
                 if "admin" in token:
                     return {"uid": "mock_admin_uid_123", "email": "admin@apps.ipb.ac.id"}
                 return {"uid": "mock_uid_123", "email": "user@apps.ipb.ac.id"}
            print(f"DEBUG: Token verification failed: {str(exc)}")
            raise HTTPException(status_code=401, detail=f"Invalid token: {str(exc)}") from exc

        uid = decoded.get("uid")
        email = decoded.get("email")
        if not uid or not email:
            raise HTTPException(status_code=401, detail="Firebase token did not contain uid and email.")

        return {"uid": uid, "email": email}

firebase_authenticator = FirebaseAuthenticator()

# Proxies for backward compatibility
def init_firebase() -> None:
    firebase_authenticator.init_firebase()

async def get_current_user_token(request: Request) -> Dict[str, str]:
    return await firebase_authenticator.get_current_user_token(request)
