// Local Fake Billing Stub

export async function hasPremiumAccess(workspaceId: string): Promise<boolean> {
    // In a real app, check Stripe subscription status in DB
    // For local dev, we default to true to allow testing premium features
    console.log(`[Billing] Checking premium access for workspace ${workspaceId}. Returning true for local dev.`);
    return true;
}

export async function createCheckoutSession(workspaceId: string, returnUrl: string): Promise<string> {
    // Return a dummy checkout URL
    console.log(`[Billing] Creating checkout session for workspace ${workspaceId}.`);
    return `${returnUrl}?local_checkout=success`;
}

export async function createCustomerPortal(workspaceId: string, returnUrl: string): Promise<string> {
    console.log(`[Billing] Creating customer portal for workspace ${workspaceId}.`);
    return `${returnUrl}?local_portal=view`;
}
