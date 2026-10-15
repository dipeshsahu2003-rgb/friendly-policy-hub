<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Shared navigation, demo state and the assistant live in the root shell so customer journeys retain mock records across client navigation.
- Demo records are held only in React memory, never sent to a service or persisted, because the project uses fictional data without real insurance processing.
- Content pages use TanStack file routes with unique metadata; insurance details share a validated dynamic route to keep plan information consistent.
- Insurance terms and simulated assistant responses are centralized in the insurance data module so disclosures and sample plan facts stay aligned.
